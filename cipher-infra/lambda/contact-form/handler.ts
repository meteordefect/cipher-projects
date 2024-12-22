import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { APIGatewayEvent } from 'aws-lambda';

const ses = new SESClient({ region: "ap-southeast-2" });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Content-Type': 'application/json'
};

export const handler = async (event: APIGatewayEvent) => {
  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  console.log('Event received:', JSON.stringify(event, null, 2));

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);

    // Input validation
    if (!body.email || !body.message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Email and message are required' }),
      };
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
      const result = await ses.send(command);
      console.log('Email sent successfully:', result);
    } catch (sesError) {
      console.error('SES Error:', sesError);
      throw new Error('Failed to send email');
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Email sent successfully',
        success: true
      }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to process request',
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};