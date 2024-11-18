import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as fs from 'fs';
import * as path from 'path';

export class CipherProjectsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    const stackProps = {
      ...props,
      crossRegionReferences: true,
    };
    super(scope, id, stackProps);

    // VPC with public and private subnets
    const vpc = new ec2.Vpc(this, 'CipherVPC', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        }
      ]
    });

    // Enhanced security group for web server
    const webServerSG = new ec2.SecurityGroup(this, 'WebServerSG', {
      vpc,
      description: 'Security group for Next.js web server',
      allowAllOutbound: true,
    });

    // Only allow HTTP from CloudFront and SSH/HTTPS for management
    webServerSG.addIngressRule(
      ec2.Peer.ipv4('130.176.0.0/16'),
      ec2.Port.tcp(80),
      'Allow CloudFront HTTP'
    );
    
    webServerSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS'
    );

    webServerSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH'
    );

    // Deployment bucket with versioning
    const deploymentBucket = new s3.Bucket(this, 'DeploymentBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Create CloudFront log bucket
    const logBucket = new s3.Bucket(this, 'CloudFrontLogBucket', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Add CloudFront logging permissions to log bucket
    logBucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [
        `${logBucket.bucketArn}/*`
      ],
      conditions: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/*`
        }
      }
    }));

    // Enhanced EC2 role with specific permissions
    const role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'),
      ],
    });

    // S3 permissions
    const s3Actions = [
      's3:GetObject',
      's3:ListBucket',
      's3:GetBucketLocation',
      's3:GetObjectVersion',
      's3:HeadBucket',
      's3:HeadObject'
    ];

    // Add S3 permissions to EC2 role
    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: s3Actions,
      resources: [
        deploymentBucket.bucketArn,
        `${deploymentBucket.bucketArn}/*`
      ],
    }));

    // Add S3 permissions to bucket policy
    deploymentBucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal(role.roleArn)],
      actions: s3Actions,
      resources: [
        deploymentBucket.bucketArn,
        `${deploymentBucket.bucketArn}/*`
      ],
    }));

    // Add EC2 permissions
    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ec2:DescribeInstances',
        'ec2:DescribeTags',
        'ec2:DescribeInstanceAttribute',
        'ec2:DescribeInstanceStatus',
      ],
      resources: [`arn:aws:ec2:${this.region}:${this.account}:instance/*`],
    }));

    // Create instance profile
    const instanceProfile = new iam.CfnInstanceProfile(this, 'EC2InstanceProfile', {
      roles: [role.roleName],
    });

    // Enhanced user data script
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      `# Version: ${Date.now()}  # This forces replacement on each deploy
    export DEPLOYMENT_BUCKET=${deploymentBucket.bucketName}`,
      fs.readFileSync(path.join(__dirname, 'user-data.sh'), 'utf8')
    );

    // Common tags for resources
    const commonTags = [
      { key: 'DeploymentBucketName', value: deploymentBucket.bucketName },
      { key: 'Environment', value: 'production' },
      { key: 'Name', value: 'CipherProjects-WebServer' },
      { key: 'Application', value: 'CipherProjects' },
      { key: 'Managed-By', value: 'CDK' }
    ];

    // Create the Launch Template
    const launchTemplate = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
      launchTemplateData: {
        instanceType: 't3.small',
        imageId: new ec2.AmazonLinuxImage({
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
          cpuType: ec2.AmazonLinuxCpuType.X86_64,
        }).getImage(this).imageId,
        securityGroupIds: [webServerSG.securityGroupId],
        iamInstanceProfile: {
          arn: instanceProfile.attrArn,
        },
        blockDeviceMappings: [
          {
            deviceName: '/dev/xvda',
            ebs: {
              volumeSize: 20,
              volumeType: 'gp3',
              encrypted: true,
            },
          },
        ],
        metadataOptions: {
          httpEndpoint: 'enabled',
          httpTokens: 'required',
          httpPutResponseHopLimit: 2,
          instanceMetadataTags: 'enabled',
        },
        userData: cdk.Fn.base64(userData.render()),
      },
    });

    // Create the EC2 Instance using the Launch Template
    const instance = new ec2.CfnInstance(this, 'WebServerInstance', {
      launchTemplate: {
        launchTemplateId: launchTemplate.ref,
        version: launchTemplate.attrLatestVersionNumber,
      },
      subnetId: vpc.publicSubnets[0].subnetId,
      tags: commonTags,
    });

    // Set update replace policy
    instance.cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.DELETE;

    // Use existing certificate
    const certificate = acm.Certificate.fromCertificateArn(this, 'SiteCertificate',
      'arn:aws:acm:us-east-1:285572126612:certificate/a891abf9-cbc6-4c64-9861-00730703a7f1'
    );

    // Enhanced CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(instance.attrPublicDnsName, {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          httpPort: 80,
          keepaliveTimeout: cdk.Duration.seconds(60),
          readTimeout: cdk.Duration.seconds(30),
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      },
      certificate: certificate,
      domainNames: ['cipherprojects.com'],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      enableLogging: true,
      logBucket: logBucket,
      logFilePrefix: 'cloudfront-logs/',
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    });

    // Add explicit dependencies
    distribution.node.addDependency(instance);
    distribution.node.addDependency(logBucket);

    // Outputs for deployment reference
    new cdk.CfnOutput(this, 'InstanceId', { value: instance.ref });
    new cdk.CfnOutput(this, 'DeploymentBucketName', { value: deploymentBucket.bucketName });
    new cdk.CfnOutput(this, 'InstancePublicDNS', { value: instance.attrPublicDnsName });
    new cdk.CfnOutput(this, 'CloudFrontDomain', { value: distribution.distributionDomainName });
  }
}