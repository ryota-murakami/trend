'use client'

import { useState, useEffect } from 'react'
import {
  isPushNotificationSupported,
  registerServiceWorker,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  sendSubscriptionToServer,
  removeSubscriptionFromServer,
  PushSubscriptionData,
} from '@/lib/push-notifications'

/**
 * SubscriptionButton allows users to subscribe/unsubscribe
 * to push notifications for new weekly reports.
 */
export default function SubscriptionButton() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [subscription, setSubscription] =
    useState<PushSubscriptionData | null>(null)

  useEffect(() => {
    // Check if push notifications are supported
    const supported = isPushNotificationSupported()
    setIsSupported(supported)

    if (supported) {
      // Register service worker and check subscription status
      registerServiceWorker().then((registration) => {
        if (registration) {
          checkSubscriptionStatus(registration)
        }
      })
    }
  }, [])

  const checkSubscriptionStatus = async (
    registration: ServiceWorkerRegistration
  ) => {
    try {
      const existingSubscription =
        await registration.pushManager.getSubscription()
      if (existingSubscription) {
        const subscriptionData: PushSubscriptionData = {
          endpoint: existingSubscription.endpoint,
          keys: {
            p256dh: '', // These would need to be extracted properly
            auth: '',
          },
        }
        setSubscription(subscriptionData)
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
    }
  }

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const subscriptionData = await subscribeToPushNotifications()
      if (subscriptionData) {
        const success = await sendSubscriptionToServer(subscriptionData)
        if (success) {
          setSubscription(subscriptionData)
          setIsSubscribed(true)
        } else {
          alert('Failed to subscribe to notifications')
        }
      }
    } catch (error) {
      console.error('Error subscribing:', error)
      alert('Failed to subscribe to notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setIsLoading(true)
    try {
      if (subscription) {
        await removeSubscriptionFromServer(subscription.endpoint)
      }
      const success = await unsubscribeFromPushNotifications()
      if (success) {
        setSubscription(null)
        setIsSubscribed(false)
      } else {
        alert('Failed to unsubscribe from notifications')
      }
    } catch (error) {
      console.error('Error unsubscribing:', error)
      alert('Failed to unsubscribe from notifications')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-[var(--text-muted)]">
        Push notifications are not supported in your browser
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isSubscribed ? (
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Subscribed to notifications
          </div>
          <button
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="btn-primary inline-flex items-center gap-2 text-base"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {isLoading ? 'Subscribing...' : 'Subscribe to Notifications'}
          </button>
          <p className="max-w-sm text-center text-sm text-[var(--text-muted)]">
            Get notified when new weekly reports are published
          </p>
        </div>
      )}
    </div>
  )
}
