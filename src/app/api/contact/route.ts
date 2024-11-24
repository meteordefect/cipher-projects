import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Log to help debug
    console.log('Sending to API Gateway:', process.env.API_GATEWAY_URL)
    console.log('With body:', body)
    
    const response = await fetch(process.env.API_GATEWAY_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        budget: body.budget || '',
        message: body.message
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API Gateway Error:', errorData)
      throw new Error('Failed to send message')
    }

    const data = await response.json()
    console.log('Success response:', data)

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error in contact API route:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}