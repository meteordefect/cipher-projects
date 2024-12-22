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
        VERSION: '1.0.2', // Increment version to force update
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

    // Create API Gateway
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

    // Create API Key - remove the enabled property
    const apiKey = api.addApiKey('ContactFormApiKey', {
      apiKeyName: `contact-form-key-${Date.now()}`,
      description: 'API Key for Contact Form'
    });



    // Create Usage Plan
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

    // Associate API key with usage plan
    usagePlan.addApiKey(apiKey);

    // Create contact resource
    const contact = api.root.addResource('contact');

    // Create integration response model
    const errorResponseModel = api.addModel('ErrorResponseModel', {
      contentType: 'application/json',
      modelName: 'ErrorResponse',
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: 'errorResponse',
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          message: { type: apigateway.JsonSchemaType.STRING }
        }
      }
    });

    // Add POST method with integration
    const integration = new apigateway.LambdaIntegration(contactFormLambda, {
      proxy: false,
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'https://www.cipherprojects.com'",
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Api-Key'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
            'method.response.header.Access-Control-Allow-Credentials': "'true'"
          }
        },
        {
          selectionPattern: '.*"statusCode":400.*',
          statusCode: '400',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'https://www.cipherprojects.com'",
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Api-Key'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
            'method.response.header.Access-Control-Allow-Credentials': "'true'"
          }
        },
        {
          selectionPattern: '.*"statusCode":403.*',
          statusCode: '403',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'https://www.cipherprojects.com'",
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Api-Key'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
            'method.response.header.Access-Control-Allow-Credentials': "'true'"
          }
        }
      ],
      requestTemplates: {
        'application/json': '{ "statusCode": 200 }'
      }
    });

    // Add POST method with responses for all status codes
    contact.addMethod('POST', integration, {
      apiKeyRequired: true,
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          }
        },
        {
          statusCode: '400',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          },
          responseModels: {
            'application/json': errorResponseModel
          }
        },
        {
          statusCode: '403',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          },
          responseModels: {
            'application/json': errorResponseModel
          }
        }
      ]
    });

    // Output values
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