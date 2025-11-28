export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('Service Worker registered successfully')
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

export async function subscribeToPushNotifications(): Promise<PushSubscriptionData | null> {
  if (!('PushManager' in window)) {
    console.log('Push notifications not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    
    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription()
    if (existingSubscription) {
      console.log('Already subscribed to push notifications')
      return {
        endpoint: existingSubscription.endpoint,
        keys: {
          p256dh: existingSubscription.options.applicationServerKey?.toString() || '',
          auth: '' // This should be extracted from the subscription
        }
      }
    }

    // Request notification permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.log('Notification permission denied')
      return null
    }

    // Subscribe to push notifications
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidPublicKey) {
      console.error('VAPID public key not configured')
      return null
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
    })

    // Extract subscription data
    const subscriptionData = await subscription.toJSON()
    
    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscriptionData.keys?.p256dh || '',
        auth: subscriptionData.keys?.auth || ''
      }
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error)
    return null
  }
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    
    if (subscription) {
      await subscription.unsubscribe()
      console.log('Unsubscribed from push notifications')
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error)
    return false
  }
}

export async function sendSubscriptionToServer(subscription: PushSubscriptionData): Promise<boolean> {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })

    if (!response.ok) {
      console.error('Failed to send subscription to server')
      return false
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error sending subscription to server:', error)
    return false
  }
}

export async function removeSubscriptionFromServer(endpoint: string): Promise<boolean> {
  try {
    const response = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    })

    if (!response.ok) {
      console.error('Failed to remove subscription from server')
      return false
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error removing subscription from server:', error)
    return false
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Check if push notifications are supported
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}