export interface TrendingRepo {
  name: string
  url: string
  description: string
  starsThisWeek: number
  language: string
  totalStars: number
  forks: number
}

export interface Library {
  name: string
  url: string
  description: string
  category: string
}

export interface RepoDetails {
  name: string
  fullName: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  updatedAt: string
  url: string
  homepage: string | null
}

export interface Report {
  week: string
  title: string
  date: string
  content: string
  excerpt: string
}

export interface ReportFrontmatter {
  title: string
  week: string
  date: string
}

export interface Subscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}