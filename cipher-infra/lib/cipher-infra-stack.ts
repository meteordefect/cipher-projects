import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

// Split into two nested stacks
class InfrastructureStack extends cdk.NestedStack {
  public readonly vpc: ec2.Vpc;
  public readonly deploymentBucket: s3.Bucket;
  public readonly webServerSG: ec2.SecurityGroup;
  
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    // VPC
    this.vpc = new ec2.Vpc(this, 'CipherVPC', {
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

    // Security Group
    this.webServerSG = new ec2.SecurityGroup(this, 'WebServerSG', {
      vpc: this.vpc,
      description: 'Security group for Next.js web server',
      allowAllOutbound: true,
    });

    this.webServerSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP'
    );

    this.webServerSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS'
    );

    // Deployment bucket
    this.deploymentBucket = new s3.Bucket(this, 'DeploymentBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      bucketName: `cipher-deployment-${cdk.Stack.of(this).region}-${cdk.Stack.of(this).account}`,
    });
  }
}

class WebServerStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, infrastructure: InfrastructureStack, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    // EC2 Role
    const role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    infrastructure.deploymentBucket.grantRead(role);

    // User Data
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      `# Version: ${Date.now()}`,
      `export DEPLOYMENT_BUCKET="${infrastructure.deploymentBucket.bucketName}"`,
      fs.readFileSync(path.join(__dirname, 'user-data.sh'), 'utf8')
    );

    // EC2 Instance
    const instance = new ec2.Instance(this, 'WebServer', {
      vpc: infrastructure.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
      }),
      userData,
      securityGroup: infrastructure.webServerSG,
      role,
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(instance.instancePublicDnsName, {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    // Outputs
    new cdk.CfnOutput(this, 'InstanceId', { value: instance.instanceId });
    new cdk.CfnOutput(this, 'InstancePublicDNS', { value: instance.instancePublicDnsName });
    new cdk.CfnOutput(this, 'DistributionDomainName', { value: distribution.distributionDomainName });
  }
}

export class CipherStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create infrastructure first
    const infrastructure = new InfrastructureStack(this, 'Infrastructure');
    
    // Create web server stack that depends on infrastructure
    const webServer = new WebServerStack(this, 'WebServer', infrastructure);

    // Output the bucket name for GitHub Actions
    new cdk.CfnOutput(this, 'DeploymentBucketName', { 
      value: infrastructure.deploymentBucket.bucketName 
    });
  }
}