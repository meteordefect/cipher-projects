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

    // Read user-data.sh and inject bucket name
    const userDataScriptPath = path.join(__dirname, 'user-data.sh');
    let userDataScript = fs.readFileSync(userDataScriptPath, 'utf8');

    // Create User Data
    const userData = ec2.UserData.forLinux();
    
    // Add the bucket name as an environment variable
    userData.addCommands(`export DEPLOYMENT_BUCKET="${deploymentBucket.bucketName}"`);
    
    // Add helper function for S3 object checking
    userData.addCommands(`
      wait_for_s3_object() {
        local bucket=$1
        local key=$2
        local max_attempts=30
        local attempt=1
        
        while [ $attempt -le $max_attempts ]; do
          if aws s3api head-object --bucket "$bucket" --key "$key" 2>/dev/null; then
            echo "Object found!"
            return 0
          fi
          echo "Attempt $attempt: Object not found, waiting..."
          sleep 10
          attempt=$((attempt + 1))
        done
        
        return 1
      }
    `);

    // Add the rest of the user data script
    userData.addCommands(userDataScript);

    // EC2 Instance
    const instance = new ec2.Instance(this, 'WebServer', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
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