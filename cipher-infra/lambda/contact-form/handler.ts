import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

const ses = new SESClient({ region: "ap-southeast-2" });

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.cipherprojects.com',
  'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body)
});

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));

  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }

  try {
    if (!event.body) {
      return createResponse(400, { error: 'Missing request body' });
    }

    const body = JSON.parse(event.body);
    console.log('Parsed body:', body);

    if (!body.email || !body.message) {
      return createResponse(400, { error: 'Email and message are required' });
    }

    const params = {
      Destination: {
        ToAddresses: ['keith.vaughan@cipherprojects.com'],
      },
      Message: {
        Body: {
          Text: {
            Data: `
New Contact Form Submission:
---------------------------
Name: ${body.name || 'Not provided'}
Email: ${body.email}
Phone: ${body.phone || 'Not provided'}
Budget: ${body.budget || 'Not provided'}
Message: ${body.message}

Submitted at: ${new Date().toISOString()}
`,
          },
        },
        Subject: {
          Data: 'New Contact Form Submission - Cipher Projects'
        },
      },
      Source: 'keith.vaughan@cipherprojects.com',
    };

    try {
      const command = new SendEmailCommand(params);
      await ses.send(command);
      return createResponse(200, {
        message: 'Message sent successfully',
        success: true
      });
    } catch (sesError) {
      console.error('SES Error:', sesError);
      return createResponse(500, {
        error: 'Failed to send email',
        success: false
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, {
      error: 'Failed to process request',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};