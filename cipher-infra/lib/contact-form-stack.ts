import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class ContactFormStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function (no changes)
    const contactFormHandler = new nodejs.NodejsFunction(this, 'ContactFormHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../lambda/contact-form/handler.ts'),
      handler: 'handler',
      environment: {
        RECIPIENT_EMAIL: 'keith.vaughan@cipherprojects.com',
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
    });

    // Add SES permissions (no changes)
    contactFormHandler.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ses:SendEmail',
        'ses:SendRawEmail'
      ],
      resources: ['*'],
    }));

    // Create API Gateway with API key requirement
    const api = new apigateway.RestApi(this, 'ContactFormApi', {
      restApiName: 'Contact Form Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'x-api-key'], // Added x-api-key
        maxAge: cdk.Duration.days(1),
      },
      cloudWatchRole: true,
      deployOptions: {   
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true
      }
    });

    // Create API key
    const apiKey = new apigateway.ApiKey(this, 'ContactFormApiKey');

    // Create usage plan
    const plan = new apigateway.UsagePlan(this, 'ContactFormUsagePlan', {
      name: 'ContactFormUsagePlan',
      apiStages: [{
        api,
        stage: api.deploymentStage,
      }],
    });

    // Associate API key with usage plan
    plan.addApiKey(apiKey);

    // Add Lambda integration with API key requirement
    const contact = api.root.addResource('contact');
    contact.addMethod('POST', 
      new apigateway.LambdaIntegration(contactFormHandler),
      {
        apiKeyRequired: true // This makes the API key required
      }
    );

    // Output both API URL and API key
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'ApiKey', {
      value: apiKey.keyId,
      description: 'API Key ID',
    });
  }
}