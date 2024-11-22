import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs'; // Corrected this import
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class ContactFormStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const contactFormHandler = new nodejs.NodejsFunction(this, 'ContactFormHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../lambda/contact-form/handler.ts'),
      handler: 'handler',
      environment: {
        RECIPIENT_EMAIL: 'keith.vaughan@cipherprojects.com', // Replace with your email
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
    });

    // Add SES permissions to Lambda
    contactFormHandler.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ses:SendEmail',
        'ses:SendRawEmail'
      ],
      resources: ['*'], // You might want to restrict this to specific SES ARNs
    }));

   // Create API Gateway with simplified logging setup
    const api = new apigateway.RestApi(this, 'ContactFormApi', {
      restApiName: 'Contact Form Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type'],
        maxAge: cdk.Duration.days(1),
      },
      cloudWatchRole: true,  // Move this up to the main config
      deployOptions: {   
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true
      }
    });

    // Add Lambda integration
    const contact = api.root.addResource('contact');
    contact.addMethod('POST', new apigateway.LambdaIntegration(contactFormHandler));

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
}