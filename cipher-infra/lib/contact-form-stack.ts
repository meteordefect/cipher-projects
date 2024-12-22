import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ses from 'aws-cdk-lib/aws-ses';
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
      },
    });

    // Add SES permissions to Lambda
    contactFormLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'], // You might want to restrict this to specific SES ARNs
      })
    );

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'ContactFormApi', {
      restApiName: 'Contact Form API',
      description: 'API for handling contact form submissions',
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://www.cipherprojects.com'],
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'X-Api-Key'],
        allowCredentials: true,
        maxAge: cdk.Duration.days(1),
      },
    });

    // Create API Key and Usage Plan
    const apiKey = api.addApiKey('ContactFormApiKey', {
      apiKeyName: 'contact-form-key',
      description: 'API Key for Contact Form',
    });

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

    // Create the API resource and method
    const contact = api.root.addResource('contact');

    // Add Lambda integration
    const integration = new apigateway.LambdaIntegration(contactFormLambda, {
      proxy: true,
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': "'https://www.cipherprojects.com'",
          'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Api-Key'",
          'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
          'method.response.header.Access-Control-Allow-Credentials': "'true'"
        }
      }]
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
          'method.response.header.Access-Control-Allow-Credentials': true
        }
      }]
    });

    // Add OPTIONS method (for CORS)
    contact.addMethod('OPTIONS', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': "'https://www.cipherprojects.com'",
          'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Api-Key'",
          'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
          'method.response.header.Access-Control-Allow-Credentials': "'true'"
        }
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    }), {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Credentials': true
        }
      }]
    });

    // Add Usage Plan to API stage
    usagePlan.addApiStage({
      stage: api.deploymentStage,
    });

    // Output values
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