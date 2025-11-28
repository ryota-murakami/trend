import { NextRequest, NextResponse } from 'next/server'
import { addSubscription } from '@/lib/subscriptions'
import { Subscription } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the subscription data
    if (!body.endpoint || !body.keys || !body.keys.p256dh || !body.keys.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      )
    }
    
    const subscription: Subscription = {
      endpoint: body.endpoint,
      keys: {
        p256dh: body.keys.p256dh,
        auth: body.keys.auth
      }
    }
    
    const success = addSubscription(subscription)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Subscription already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}