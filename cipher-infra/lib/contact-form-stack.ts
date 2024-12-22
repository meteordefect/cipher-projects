import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import { Construct } from 'constructs';

export class ContactFormStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the Lambda function
    const contactFormLambda = new lambda.Function(this, 'ContactFormFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/contact-form')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_ENV: 'production',
        VERSION: '1.0.1', // Add version to force update
      },
    });

    // Add SES permissions to Lambda
    contactFormLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      })
    );

    // Create API Gateway with CORS configuration
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
        maxAge: cdk.Duration.days(1),
      },
    });

    // Create API Key
    const apiKey = api.addApiKey('ContactFormApiKey', {
      apiKeyName: `contact-form-key-${Date.now()}`, // Add timestamp to force update
      description: 'API Key for Contact Form',
    });

    // Create Usage Plan
    const usagePlan = api.addUsagePlan('ContactFormUsagePlan', {
      name: 'Contact Form Usage Plan',
      throttle: {
        rateLimit: 10,
        burstLimit: 5,
      },
      quota: {
        limit: 1000,
        period: apigateway.Period.MONTH,
      },
    });

    // Associate the API key with the usage plan
    usagePlan.addApiKey(apiKey);

    // Create the contact resource
    const contact = api.root.addResource('contact');

    // Add POST method with Lambda integration
    const integration = new apigateway.LambdaIntegration(contactFormLambda, {
      proxy: true,
    });

    // Add POST method
    contact.addMethod('POST', integration, {
      apiKeyRequired: true,
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Credentials': true,
        },
      }],
    });

    // Add Usage Plan to API stage
    usagePlan.addApiStage({
      stage: api.deploymentStage,
    });

    // Output values with more descriptive information
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