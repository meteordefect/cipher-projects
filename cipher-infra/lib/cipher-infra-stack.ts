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
    super(scope, id, props);

    // VPC setup
    const vpc = new ec2.Vpc(this, 'CipherVPC', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ]
    });

    // Create security group first
    const webServerSG = new ec2.SecurityGroup(this, 'WebServerSG', {
      vpc,
      description: 'Security group for web server',
      allowAllOutbound: true,
    });

    // Add inbound rules
    webServerSG.addIngressRule(
      ec2.Peer.ipv4('130.176.0.0/16'),
      ec2.Port.tcp(80),
      'Allow CloudFront HTTP'
    );
    
    webServerSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS for SSM'
    );

    // Deployment bucket
    const deploymentBucket = new s3.Bucket(this, 'DeploymentBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // EC2 role with expanded permissions
    const role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    // Add permissions for EC2 tags and metadata
    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ec2:DescribeInstances',
        'ec2:DescribeTags',
        'ec2:DescribeInstanceAttribute',
        'ec2:DescribeInstanceStatus',
      ],
      resources: ['*'],
    }));

    // Grant S3 permissions explicitly
    deploymentBucket.grantRead(role);

    // Add specific S3 permissions for the bucket
    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
        's3:ListBucket',
      ],
      resources: [
        deploymentBucket.bucketArn,
        `${deploymentBucket.bucketArn}/*`
      ],
    }));

    // Create instance profile
    const instanceProfile = new iam.CfnInstanceProfile(this, 'EC2InstanceProfile', {
      roles: [role.roleName],
    });

    // User data with deployment configuration
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      // Set the bucket name for the deployment script to use
      'export DEPLOYMENT_BUCKET=' + deploymentBucket.bucketName,
      
      // Read and include the contents of user-data.sh
      fs.readFileSync(path.join(__dirname, 'user-data.sh'), 'utf8')
    );
    
    // Single EC2 Instance definition
    const instance = new ec2.Instance(this, 'WebServer', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      machineImage: ec2.MachineImage.fromSsmParameter(
        '/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64'
      ),
      userData,
      role,
      requireImdsv2: true,
      associatePublicIpAddress: true,
      securityGroup: webServerSG
    });

    // Add tags that will be accessible via metadata
    cdk.Tags.of(instance).add('DeploymentBucketName', deploymentBucket.bucketName);

    // Reference existing certificate
    const certificate = acm.Certificate.fromCertificateArn(this, 'SiteCertificate',
      'arn:aws:acm:us-east-1:285572126612:certificate/a891abf9-cbc6-4c64-9861-00730703a7f1'
    );

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(instance.instancePublicDnsName),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: certificate,
      domainNames: ['cipherprojects.com'],
    });

    // Outputs
    new cdk.CfnOutput(this, 'InstanceId', {
      value: instance.instanceId,
    });
    new cdk.CfnOutput(this, 'DeploymentBucketName', {
      value: deploymentBucket.bucketName,
    });
    new cdk.CfnOutput(this, 'InstancePublicDNS', {
      value: instance.instancePublicDnsName,
    });
    new cdk.CfnOutput(this, 'CloudFrontDomain', {
      value: distribution.distributionDomainName,
    });
  }
}