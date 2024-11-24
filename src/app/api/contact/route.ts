import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('API Route received body:', body) // Debug log

    if (!process.env.API_GATEWAY_URL) {
      console.error('API_GATEWAY_URL is not defined') // Debug log
      throw new Error('API endpoint not configured')
    }

    console.log('Sending to:', process.env.API_GATEWAY_URL) // Debug log
    
    const response = await fetch(process.env.API_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    console.log('API Gateway response status:', response.status) // Debug log

    const responseData = await response.text()
    console.log('API Gateway response:', responseData) // Debug log

    if (!response.ok) {
      throw new Error(responseData || 'Failed to send message')
    }

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error in contact API route:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    )
  }
}