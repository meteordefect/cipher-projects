import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class CipherProjectsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Deployment bucket for application code
    const deploymentBucket = new s3.Bucket(this, 'DeploymentBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // VPC setup remains the same
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

    // EC2 Role with additional permissions
    const role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    // Add permission to access deployment bucket
    deploymentBucket.grantRead(role);

    // Initial setup script
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'yum update -y',
      'yum install -y nodejs nginx git unzip',
      'npm install -g pm2',
      
      // Basic nginx setup for Node.js
      'echo "server { \
        listen 80; \
        location / { \
          proxy_pass http://localhost:3000; \
          proxy_http_version 1.1; \
          proxy_set_header Upgrade $http_upgrade; \
          proxy_set_header Connection \'upgrade\'; \
          proxy_set_header Host $host; \
          proxy_cache_bypass $http_upgrade; \
        } \
      }" > /etc/nginx/conf.d/app.conf',
      
      'systemctl enable nginx',
      'systemctl start nginx',
      
      'mkdir -p /var/www/cipher-projects',
    );

    // EC2 Instance
    const instance = new ec2.Instance(this, 'WebServer', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData,
      role,
    });

    // Allow inbound traffic
    instance.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(instance.instancePublicDnsName),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
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
