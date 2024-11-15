#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CipherInfraStack } from '../lib/cipher-infra-stack';


const app = new cdk.App();
new CipherProjectsStack(app, 'CipherProjectsStack', {
  env: {
    account: '285572126612',
    region: 'ap-southeast-2'  // or your preferred region
  }
});
