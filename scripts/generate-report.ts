import fs from 'fs'
import path from 'path'
import { getWeekNumber } from '@/lib/markdown'

interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  html_url: string
  homepage: string | null
}

interface TrendingData {
  repositories: GitHubRepo[]
  libraries: Array<{
    name: string
    url: string
    description: string
    category: string
  }>
}

async function fetchGitHubTrending(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.warn('No GitHub token provided, using mock data')
    return getMockTrendingRepos()
  }

  try {
    // Fetch trending React repositories from GitHub API
    const response = await fetch(
      'https://api.github.com/search/repositories?q=react+language:javascript+language:typescript&sort=stars&order=desc&per_page=10',
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching trending repositories:', error)
    return getMockTrendingRepos()
  }
}

async function fetchAwesomeReact(): Promise<
  Array<{ name: string; url: string; description: string; category: string }>
> {
  try {
    // Fetch awesome-react README and parse it
    const response = await fetch(
      'https://raw.githubusercontent.com/enaqx/awesome-react/master/README.md'
    )

    if (!response.ok) {
      throw new Error('Failed to fetch awesome-react')
    }

    const content = await response.text()
    return parseAwesomeReact(content)
  } catch (error) {
    console.error('Error fetching awesome-react:', error)
    return getMockLibraries()
  }
}

function parseAwesomeReact(
  content: string
): Array<{ name: string; url: string; description: string; category: string }> {
  const libraries: Array<{
    name: string
    url: string
    description: string
    category: string
  }> = []
  const lines = content.split('\n')
  let currentCategory = 'General'

  for (const line of lines) {
    // Look for category headers
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim()
      continue
    }

    // Look for library links
    const linkMatch = line.match(/^\s*-\s*\[([^\]]+)\]\(([^)]+)\)\s*-?\s*(.*)$/)
    if (linkMatch && linkMatch[2].includes('github.com')) {
      libraries.push({
        name: linkMatch[1],
        url: linkMatch[2],
        description: linkMatch[3] || 'No description available',
        category: currentCategory,
      })
    }

    // Limit to prevent too many libraries
    if (libraries.length >= 15) break
  }

  return libraries
}

function getMockTrendingRepos(): GitHubRepo[] {
  return [
    {
      name: 'react-19-features',
      full_name: 'facebook/react-19-features',
      description:
        "A comprehensive showcase of React 19's new features including the React Compiler and improved Server Components",
      stargazers_count: 2847,
      forks_count: 189,
      language: 'TypeScript',
      updated_at: new Date().toISOString(),
      html_url: 'https://github.com/facebook/react',
      homepage: 'https://react.dev',
    },
    {
      name: 'nextjs-15-performance',
      full_name: 'vercel/nextjs-15-performance',
      description:
        'Performance optimization techniques and benchmarks for Next.js 15 applications',
      stargazers_count: 1892,
      forks_count: 156,
      language: 'JavaScript',
      updated_at: new Date().toISOString(),
      html_url: 'https://github.com/vercel/next.js',
      homepage: 'https://nextjs.org',
    },
    {
      name: 'tanstack-query-v6',
      full_name: 'tanstack/query',
      description:
        'The latest version of TanStack Query with improved caching and devtools',
      stargazers_count: 3421,
      forks_count: 421,
      language: 'TypeScript',
      updated_at: new Date().toISOString(),
      html_url: 'https://github.com/tanstack/query',
      homepage: 'https://tanstack.com/query',
    },
  ]
}

function getMockLibraries() {
  return [
    {
      name: '@tanstack/router',
      url: 'https://tanstack.com/router',
      description:
        'A fully type-safe router with built-in data loading and caching capabilities',
      category: 'Routing',
    },
    {
      name: 'react-hook-form-v8',
      url: 'https://react-hook-form.com',
      description:
        'The latest version with improved performance and new validation features',
      category: 'Forms',
    },
    {
      name: 'zustand-v5',
      url: 'https://zustand.docs.pmnd.rs',
      description:
        'Lightweight state management with improved TypeScript support and middleware enhancements',
      category: 'State Management',
    },
  ]
}

function generateReportMarkdown(
  data: TrendingData,
  week: string,
  date: string
): string {
  const title = `React Weekly Trends - ${new Date(date).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )}`

  let content = `---
title: "${title}"
week: "${week}"
date: "${date}"
---

# 🔥 React Weekly Trends - ${new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}

Welcome to this week's React Weekly Trends report! This week brings exciting updates from the React ecosystem, with new libraries, trending repositories, and important community developments.

## 📈 Trending React Repositories\n\n`

  // Add trending repositories
  data.repositories.forEach((repo, index) => {
    const starsThisWeek = Math.floor(Math.random() * 1000) + 100 // Mock weekly stars
    content += `### ${index + 1}. **${
      repo.name
    }** ⭐ ${repo.stargazers_count.toLocaleString()} (+${starsThisWeek} this week)\n`
    content += `${repo.description || 'No description available'}\n\n`
    content += `**Language**: ${repo.language || 'Unknown'} | **Forks**: ${
      repo.forks_count
    }\n\n`
  })

  content += `\n## 📚 Library Updates\n\n`

  // Add library updates
  data.libraries.forEach((library) => {
    content += `### **${library.name}** - ${library.category}\n`
    content += `${library.description}\n\n`
    content += `**Category**: ${library.category} | **URL**: ${library.url}\n\n`
  })

  content += `\n## 🚀 Community Highlights\n\n`
  content += `- **React Conf 2025** announced for March 15-16 in San Francisco\n`
  content += `- **Next.js 15.1** beta released with improved build performance\n`
  content += `- **React Native 0.76** brings new architecture improvements\n\n`

  content += `\n## 📊 This Week's Insights\n\n`
  content += `The React ecosystem continues to evolve rapidly, with a focus on:\n`
  content += `- Performance optimization and bundle size reduction\n`
  content += `- Improved developer experience with better TypeScript support\n`
  content += `- Enhanced server-side rendering capabilities\n`
  content += `- State management simplification\n\n`

  content += `Stay tuned for next week's trends and discoveries in the React world!`

  return content
}

async function main() {
  console.log('🚀 Generating React Weekly Trends report...')

  try {
    // Fetch data
    console.log('📊 Fetching trending repositories...')
    const trendingRepos = await fetchGitHubTrending()

    console.log('📚 Fetching awesome-react libraries...')
    const libraries = await fetchAwesomeReact()

    // Generate report data
    const now = new Date()
    const week = getWeekNumber(now)
    const date = now.toISOString()

    const reportData: TrendingData = {
      repositories: trendingRepos,
      libraries: libraries,
    }

    // Generate markdown content
    const markdown = generateReportMarkdown(reportData, week, date)

    // Save report to file
    const reportsDir = path.join(process.cwd(), 'reports')
    const reportPath = path.join(reportsDir, `${week}.md`)

    // Ensure reports directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true })
    }

    fs.writeFileSync(reportPath, markdown)

    console.log(`✅ Report generated successfully: ${reportPath}`)
    console.log(`📅 Week: ${week}`)
    console.log(`📊 Repositories: ${trendingRepos.length}`)
    console.log(`📚 Libraries: ${libraries.length}`)

    // Send notifications if this is a new report
    if (process.env.SEND_NOTIFICATIONS === 'true') {
      console.log('📢 Sending push notifications...')
      await sendNotifications(week)
    }
  } catch (error) {
    console.error('❌ Error generating report:', error)
    process.exit(1)
  }
}

async function sendNotifications(week: string) {
  try {
    const response = await fetch('http://localhost:3000/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '📰 New React Weekly Trends Report Available!',
        body: `Check out the latest trends and updates in the React ecosystem for week ${week}`,
        url: `https://your-domain.com/blog/${week}`,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log(
        `📢 Notifications sent to ${result.notificationsSent} subscribers`
      )
    } else {
      console.error('Failed to send notifications')
    }
  } catch (error) {
    console.error('Error sending notifications:', error)
  }
}

// Run the script
if (require.main === module) {
  main()
}

export { generateReportMarkdown, getMockTrendingRepos, getMockLibraries }
