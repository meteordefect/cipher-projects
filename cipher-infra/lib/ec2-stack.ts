import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as fs from 'fs'; 
import * as path from 'path'; 

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
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
      ],
    });

    deploymentBucket.grantRead(role);

    // Read user-data.sh
    const userDataScriptPath = path.join(__dirname, 'user-data.sh');
    const userDataScript = fs.readFileSync(userDataScriptPath, 'utf8');

    // Create User Data
    const userData = ec2.UserData.forLinux();
    
    // Add environment variable
    userData.addCommands(`export DEPLOYMENT_BUCKET=${deploymentBucket.bucketName}`);
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



    // Outputs
    new cdk.CfnOutput(this, 'WebServerPublicDNS', {
      value: instance.instancePublicDnsName,
    });
  }
}