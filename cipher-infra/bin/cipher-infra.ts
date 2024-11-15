import * as cdk from 'aws-cdk-lib';
import { CipherProjectsStack } from '../lib/cipher-infra-stack';

const app = new cdk.App();
new CipherProjectsStack(app, 'CipherProjectsStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-southeast-2',
  },
});