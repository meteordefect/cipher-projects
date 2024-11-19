import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';

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

    webServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP');
    webServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS');

    // IAM Role
    const role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    deploymentBucket.grantRead(role);

    // User Data
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
    `#!/bin/bash`,
    `BUCKET_NAME=${deploymentBucket.bucketName}`,
    `echo "Fetching deployment package from S3..."`,
    `aws s3 cp s3://${deploymentBucket.bucketName}/deploy.zip /home/ec2-user/deploy.zip`,
    `echo "Extracting deployment package..."`,
    `unzip -o /home/ec2-user/deploy.zip -d /var/www/html`,
    `echo "Deployment complete"`
    );

    // EC2 Instance
    const instance = new ec2.Instance(this, 'WebServer', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      machineImage: new ec2.AmazonLinux2023Image(),
      securityGroup: webServerSG,
      role,
      userData,
    });

    // Outputs
    new cdk.CfnOutput(this, 'InstancePublicDNS', {
      value: instance.instancePublicDnsName,
    });
  }
}
