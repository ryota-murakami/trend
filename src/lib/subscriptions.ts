import fs from 'fs'
import path from 'path'
import { Subscription } from '@/types'

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'subscriptions.json')

export function getSubscriptions(): Subscription[] {
  try {
    if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
      return []
    }
    
    const data = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading subscriptions:', error)
    return []
  }
}

export function addSubscription(subscription: Subscription): boolean {
  try {
    const subscriptions = getSubscriptions()
    
    // Check if subscription already exists
    const exists = subscriptions.some(sub => sub.endpoint === subscription.endpoint)
    if (exists) {
      return false
    }
    
    subscriptions.push(subscription)
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2))
    return true
  } catch (error) {
    console.error('Error adding subscription:', error)
    return false
  }
}

export function removeSubscription(endpoint: string): boolean {
  try {
    const subscriptions = getSubscriptions()
    const filtered = subscriptions.filter(sub => sub.endpoint !== endpoint)
    
    if (filtered.length === subscriptions.length) {
      return false // No subscription was removed
    }
    
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(filtered, null, 2))
    return true
  } catch (error) {
    console.error('Error removing subscription:', error)
    return false
  }
}