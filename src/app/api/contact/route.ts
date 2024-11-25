import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('API Route received body:', body)

    if (!process.env.API_GATEWAY_URL || !process.env.API_KEY) {
      console.error('Missing env vars:', {
        hasUrl: !!process.env.API_GATEWAY_URL,
        hasKey: !!process.env.API_KEY
      })
      throw new Error('API endpoint not configured')
    }

    console.log('Sending to API Gateway:', process.env.API_GATEWAY_URL)
    console.log('Using API Key:', process.env.API_KEY.substring(0, 5) + '...')
    
    const requestBody = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      budget: body.budget || '',
      message: body.message
    }

    console.log('Formatted request body:', requestBody)

    const response = await fetch(process.env.API_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': process.env.API_KEY
      },
      body: JSON.stringify(requestBody)
    })

    console.log('API Gateway response status:', response.status)

    let responseData
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }
    console.log('API Gateway response:', responseData)

    if (!response.ok) {
      throw new Error(typeof responseData === 'string' ? responseData : 'Failed to send message')
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    })

  } catch (error) {
    console.error('Error in contact API route:', error)
    
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',  // Added X-API-Key
      },
    }
  )
}