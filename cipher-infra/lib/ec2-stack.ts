import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as fs from 'fs'; 
import * as path from 'path'; 
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

interface EC2StackProps extends cdk.StackProps {
  deploymentBucket: s3.IBucket;
}

export class EC2Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: EC2StackProps) {
    super(scope, id, props);

    const { deploymentBucket } = props;

    // VPC
    const vpc = new ec2.Vpc(this, 'CipherVPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Security Group
    const webServerSG = new ec2.SecurityGroup(this, 'WebServerSG', {
      vpc,
      description: 'Security group for web server',
      allowAllOutbound: true,
    });

    webServerSG.addIngressRule(
        ec2.Peer.ipv4('0.0.0.0/0'),  // CloudFront IP range for ap-southeast-2
        ec2.Port.tcp(80),
        'Allow HTTP from CloudFront'
      );
      
    // Keep HTTPS open if needed
    webServerSG.addIngressRule(
        ec2.Peer.anyIpv4(),
        ec2.Port.tcp(443),
        'Allow HTTPS'
      );

    // IAM Role
    const role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
      ],
    });

    deploymentBucket.grantRead(role);

    // Read user-data.sh
    const userDataScriptPath = path.join(__dirname, 'user-data.sh');
    const userDataScript = fs.readFileSync(userDataScriptPath, 'utf8');

    // Create User Data
    const userData = ec2.UserData.forLinux();
    
    // Add environment variables with timestamp
    userData.addCommands(
      `export DEPLOYMENT_BUCKET=${deploymentBucket.bucketName}`,
      `export DEPLOYMENT_TIME="${new Date().toISOString()}"`, // Add timestamp
      `echo "Starting deployment at ${new Date().toISOString()}"`); // Log timestamp
    userData.addCommands(userDataScript);

    // EC2 Instance using Ubuntu 22.04
    const instance = new ec2.Instance(this, 'WebServer', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      machineImage: new ec2.GenericLinuxImage({
        'ap-southeast-2': 'ami-0310483fb2b488153', // Ubuntu 22.04 LTS in ap-southeast-2
      }),
      securityGroup: webServerSG,
      role,
      userData,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      }
    });

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
        defaultBehavior: {
          origin: new origins.HttpOrigin(instance.instancePublicDnsName, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            connectionAttempts: 3,
            connectionTimeout: cdk.Duration.seconds(10),
          }),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          // Use custom cache policy for default behavior
          cachePolicy: new cloudfront.CachePolicy(this, 'DefaultCachePolicy', {
            queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
            headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Accept'),
            cookieBehavior: cloudfront.CacheCookieBehavior.none(),
            defaultTtl: cdk.Duration.days(1),
          }),
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
        },
        additionalBehaviors: {
          '/_next/static/*': {
            origin: new origins.HttpOrigin(instance.instancePublicDnsName, {
              protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            }),
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          },
          '/_next/image*': {
            origin: new origins.HttpOrigin(instance.instancePublicDnsName, {
              protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            }),
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            // Custom cache policy for Next.js image optimization
            cachePolicy: new cloudfront.CachePolicy(this, 'ImageCachePolicy', {
              queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
              headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Accept'),
              cookieBehavior: cloudfront.CacheCookieBehavior.none(),
              defaultTtl: cdk.Duration.days(1),
            }),
            originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
          },
        },
        domainNames: [
            'cipherprojects.com',
            'www.cipherprojects.com',
            'cipherweekly.com',
            'www.cipherweekly.com',
          ],
        certificate: acm.Certificate.fromCertificateArn(this, 'CloudFrontCert', 
            'arn:aws:acm:us-east-1:285572126612:certificate/a891abf9-cbc6-4c64-9861-00730703a7f1'
        ),
      });

    // Output both the CloudFront URL and EC2 DNS
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    new cdk.CfnOutput(this, 'EC2PublicDNS', {
      value: instance.instancePublicDnsName,
      description: 'EC2 Public DNS (backup access)',
    });
  }
}