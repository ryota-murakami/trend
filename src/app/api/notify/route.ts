import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { getSubscriptions } from '@/lib/subscriptions'

// Configure web-push only if keys are available
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:your-email@example.com',
    vapidPublicKey,
    vapidPrivateKey
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, body: notificationBody, url } = body

    if (!title || !notificationBody) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      )
    }

    // Check if VAPID keys are configured
    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        { error: 'Push notifications not configured' },
        { status: 503 }
      )
    }

    const subscriptions = getSubscriptions()
    let successCount = 0
    const errors: string[] = []

    // Send notifications to all subscribers
    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title,
            body: notificationBody,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            url: url || 'https://your-domain.com',
          })
        )
        successCount++
      } catch (error) {
        console.error('Error sending notification to subscription:', error)
        errors.push(`Failed to send to ${subscription.endpoint}`)

        // Remove invalid subscriptions
        const webPushError = error as any
        if (
          webPushError.statusCode === 410 ||
          webPushError.statusCode === 404
        ) {
          // Subscription is expired or invalid, should be removed
          console.log('Removing invalid subscription:', subscription.endpoint)
        }
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent: successCount,
      totalSubscribers: subscriptions.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Error sending notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
