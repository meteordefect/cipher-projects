import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('API Route received body:', body) // Debug log

    if (!process.env.API_GATEWAY_URL) {
      console.error('API_GATEWAY_URL is not defined') // Debug log
      throw new Error('API endpoint not configured')
    }

    console.log('Sending to API Gateway:', process.env.API_GATEWAY_URL) // Debug log
    
    const requestBody = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      budget: body.budget || '',
      message: body.message
    }

    console.log('Formatted request body:', requestBody) // Debug log

    const response = await fetch(process.env.API_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    console.log('API Gateway response status:', response.status) // Debug log

    let responseData
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }
    console.log('API Gateway response:', responseData) // Debug log

    if (!response.ok) {
      throw new Error(typeof responseData === 'string' ? responseData : 'Failed to send message')
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    })

  } catch (error) {
    console.error('Error in contact API route:', error)
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: Request) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}