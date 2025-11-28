// Service Worker for Push Notifications

// Install event - cache resources
self.addEventListener('install', () => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(self.clients.claim())
})

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event)
  
  if (!event.data) {
    console.log('Push event has no data')
    return
  }
  
  try {
    const data = event.data.json()
    const { title, body, icon, badge, url } = data
    
    const options = {
      body: body || 'New React Weekly Trends report is available!',
      icon: icon || '/favicon.ico',
      badge: badge || '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        url: url || '/',
        dateOfArrival: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'View Report',
          icon: '/favicon.ico'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/favicon.ico'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(title || 'React Weekly Trends', options)
    )
  } catch (error) {
    console.error('Error handling push event:', error)
    
    // Fallback notification
    const options = {
      body: 'New React Weekly Trends report is available!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100]
    }
    
    event.waitUntil(
      self.registration.showNotification('React Weekly Trends', options)
    )
  }
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  const url = event.notification.data?.url || '/'
  
  event.waitUntil(
    self.clients.openWindow(url)
  )
})

// Background sync (optional - for offline functionality)
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event)
  
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports())
  }
})

async function syncReports() {
  console.log('Syncing reports...')
  // Add logic to sync reports when back online
}

// Message handling (for communication between app and service worker)
self.addEventListener('message', (event) => {
  console.log('Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})