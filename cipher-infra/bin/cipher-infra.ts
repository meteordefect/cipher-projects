import * as cdk from 'aws-cdk-lib';
import { S3Stack } from '../lib/s3-stack';
import { EC2Stack } from '../lib/ec2-stack';
import { ContactFormStack } from '../lib/contact-form-stack';

const app = new cdk.App();

// Create the S3 Stack
const s3Stack = new S3Stack(app, 'S3Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-southeast-2',
  },
});

// Create the EC2 Stack and pass the deployment bucket from the S3 Stack
new EC2Stack(app, 'EC2Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-southeast-2',
  },
  deploymentBucket: s3Stack.deploymentBucket, // Pass the S3 bucket reference
});

// Add the new Contact Form Stack
new ContactFormStack(app, 'ContactFormStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-southeast-2',
  },
});