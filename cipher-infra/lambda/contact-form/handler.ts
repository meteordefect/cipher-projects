import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { APIGatewayEvent } from 'aws-lambda';

const ses = new SESClient({ region: "ap-southeast-2" });

export const handler = async (event: APIGatewayEvent) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);

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
Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone || 'Not provided'}
Budget: ${body.budget || 'Not provided'}
Message: ${body.message}
`,
          },
        },
        Subject: { Data: 'New Contact Form Submission' },
      },
      Source: 'keith.vaughan@cipherprojects.com',
    };

    // Actually send the email
    try {
      const command = new SendEmailCommand(params);
      await ses.send(command);
      console.log('Email sent successfully');
    } catch (sesError) {
      console.error('SES Error:', sesError);
      throw new Error('Failed to send email');
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  }
};