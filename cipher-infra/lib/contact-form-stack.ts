import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import { Construct } from 'constructs';

export class ContactFormStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function
    const contactFormLambda = new lambda.Function(this, 'ContactFormFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/contact-form')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_ENV: 'production',
        VERSION: '1.0.3', // Increment version to force update
      },
    });

    // SES permissions
    contactFormLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      })
    );

    // API Gateway
    const api = new apigateway.RestApi(this, 'ContactFormApi', {
      restApiName: 'Contact Form API',
      description: 'API for handling contact form submissions',
      deployOptions: {
        stageName: 'prod',
        tracingEnabled: true,
        dataTraceEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://www.cipherprojects.com'],
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'X-Api-Key'],
        allowCredentials: true,
      },
    });

    // API Key
    const apiKey = api.addApiKey('ContactFormApiKey', {
      apiKeyName: `contact-form-key-${Date.now()}`,
      description: 'API Key for Contact Form'
    });

    // Usage Plan
    const usagePlan = api.addUsagePlan('ContactFormUsagePlan', {
      name: `ContactFormUsagePlan-${Date.now()}`,
      description: 'Usage plan for the contact form API',
      apiStages: [{
        api,
        stage: api.deploymentStage
      }],
      throttle: {
        rateLimit: 10,
        burstLimit: 5,
      },
      quota: {
        limit: 1000,
        period: apigateway.Period.MONTH,
      },
    });

    usagePlan.addApiKey(apiKey);

    // Contact Resource
    const contact = api.root.addResource('contact');

    // Integration
    const integration = new apigateway.LambdaIntegration(contactFormLambda, {
      proxy: true, // Use proxy integration for simplicity
    });

    // Method
    contact.addMethod('POST', integration, {
      apiKeyRequired: true,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: `${api.url}contact`,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'ApiKey', {
      value: apiKey.keyId,
      description: 'API Key ID',
    });
  }
}