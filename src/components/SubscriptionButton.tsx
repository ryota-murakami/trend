'use client'

import { useState, useEffect } from 'react'
import { 
  isPushNotificationSupported, 
  registerServiceWorker, 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications,
  sendSubscriptionToServer,
  removeSubscriptionFromServer,
  PushSubscriptionData
} from '@/lib/push-notifications'

export default function SubscriptionButton() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null)

  useEffect(() => {
    // Check if push notifications are supported
    const supported = isPushNotificationSupported()
    setIsSupported(supported)

    if (supported) {
      // Register service worker and check subscription status
      registerServiceWorker().then(registration => {
        if (registration) {
          checkSubscriptionStatus(registration)
        }
      })
    }
  }, [])

  const checkSubscriptionStatus = async (registration: ServiceWorkerRegistration) => {
    try {
      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        const subscriptionData: PushSubscriptionData = {
          endpoint: existingSubscription.endpoint,
          keys: {
            p256dh: '', // These would need to be extracted properly
            auth: ''
          }
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
      <div className="text-sm text-gray-500">
        Push notifications are not supported in your browser
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isSubscribed ? (
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-green-600 font-medium">
            ✅ You are subscribed to notifications
          </div>
          <button
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="rounded-lg bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Subscribing...' : '📰 Subscribe to Notifications'}
          </button>
          <p className="text-sm text-gray-600 max-w-sm">
            Get notified when new weekly reports are published
          </p>
        </div>
      )}
    </div>
  )
}