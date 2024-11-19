import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class S3Stack extends cdk.Stack {
  public readonly deploymentBucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    this.deploymentBucket = new s3.Bucket(this, 'DeploymentBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      bucketName: `cipher-deployment-${this.region}-${this.account}`,
    });

    // Output the bucket name
    new cdk.CfnOutput(this, 'DeploymentBucketName', {
      value: this.deploymentBucket.bucketName,
    });
  }
}
