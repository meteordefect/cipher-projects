// lib/contact-form-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ContactFormStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function using inline code
    const contactFormHandler = new lambda.Function(this, 'ContactFormHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
        const sesClient = new SESClient({ region: 'ap-southeast-2' });

        const createResponse = (statusCode, body) => ({
          statusCode,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        });

        exports.handler = async (event) => {
          console.log('Received event:', JSON.stringify(event, null, 2));

          try {
            if (!event.body) {
              console.error('No body received');
              return createResponse(400, { error: 'No body received' });
            }

            let body;
            try {
              body = JSON.parse(event.body);
            } catch (e) {
              console.error('Failed to parse body:', e);
              return createResponse(400, { error: 'Invalid request body' });
            }

            const { name, email, phone, budget, message } = body;

            if (!name || !email || !message) {
              console.warn('Missing required fields:', { name, email, message });
              return createResponse(400, {
                error: 'Missing required fields',
                missing: ['name', 'email', 'message'].filter(f => !body[f])
              });
            }

            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(email)) {
              console.warn('Invalid email format:', email);
              return createResponse(400, { error: 'Invalid email format' });
            }

            if (!process.env.RECIPIENT_EMAIL) {
              console.error('RECIPIENT_EMAIL environment variable not set');
              return createResponse(500, { error: 'Server configuration error' });
            }

            const command = new SendEmailCommand({
              Destination: {
                ToAddresses: [process.env.RECIPIENT_EMAIL],
              },
              Message: {
                Body: {
                  Text: {
                    Data: \`
New Contact Form Submission

Name: \${name}
Email: \${email}
Phone: \${phone || 'Not provided'}
Budget: \${budget || 'Not specified'}

Message:
\${message}

Submitted at: \${new Date().toISOString()}
IP Address: \${event.requestContext.identity?.sourceIp || 'Unknown'}
User Agent: \${event.requestContext.identity?.userAgent || 'Unknown'}
                    \`,
                  },
                },
                Subject: {
                  Data: 'New Contact Form Submission - Cipher Projects',
                },
              },
              Source: process.env.RECIPIENT_EMAIL,
            });

            await sesClient.send(command);
            console.log('Email sent successfully');

            return createResponse(200, { message: 'Message sent successfully' });
          } catch (error) {
            console.error('Error processing contact form:', error);
            
            if (error instanceof Error) {
              if (error.name === 'InvalidParameterException') {
                return createResponse(400, { error: 'Invalid email parameters' });
              }
              if (error.name === 'MessageRejected') {
                return createResponse(400, { error: 'Email rejected by SES' });
              }
            }
            
            return createResponse(500, { error: 'Failed to send message' });
          }
        };
      `),
      environment: {
        RECIPIENT_EMAIL: 'hello@cipherprojects.com', // Replace with your email
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

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'ContactFormApi', {
      restApiName: 'Contact Form Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type'],
        maxAge: cdk.Duration.days(1),
      },
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