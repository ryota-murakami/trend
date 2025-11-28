# 🚀 React Weekly Trends - Complete Setup Guide

> Automated weekly React ecosystem trend reports with Next.js 16, Push Notifications, and GitHub Actions

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Complete Project Setup](#complete-project-setup)
3. [ESLint Configuration](#eslint-configuration)
4. [Project Structure](#project-structure)
5. [Data Fetching Script](#data-fetching-script)
6. [Report Generation Script](#report-generation-script)
7. [GitHub Actions Configuration](#github-actions-configuration)
8. [Next.js Pages Implementation](#nextjs-pages-implementation)
9. [Push Notifications Setup](#push-notifications-setup)
10. [Utility Functions](#utility-functions)
11. [Deployment Guide](#deployment-guide)
12. [Usage & Maintenance](#usage-maintenance)

---

## 📖 Project Overview

### Features

✅ **Weekly automated report generation**  
✅ **Next.js 16 App Router with TypeScript**  
✅ **Desktop push notifications**  
✅ **All English text and comments**  
✅ **eslint-config-ts-prefixer configured**  
✅ **GitHub Actions CI/CD**  
✅ **Past reports archive**  
✅ **Tailwind CSS styling**

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint with eslint-config-ts-prefixer
- **Automation**: GitHub Actions
- **Notifications**: Web Push API
- **Deployment**: Vercel

---

## 🚀 Complete Project Setup

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest react-weekly-trends --typescript --tailwind --app --eslint
cd react-weekly-trends

# Install required packages
npm install @octokit/rest cheerio gray-matter marked date-fns web-push
npm install -D tsx @types/node @types/web-push

# Install eslint-config-ts-prefixer
npm install -D eslint-config-ts-prefixer@latest
```

---

## 🔧 ESLint Configuration

### Step 2: Configure ESLint

Create `eslint.config.mjs`:

```javascript
// @ts-check
import { defineConfig } from 'eslint/config'
import tsPrefixer from 'eslint-config-ts-prefixer'

export default defineConfig([
  ...tsPrefixer,
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      '**/.vercel/**',
      '**/public/sw.js',
    ],
  },
])
```

### Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "generate-report": "tsx scripts/generate-report.ts",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 📁 Project Structure

### Step 3: Create Project Structure

```
react-weekly-trends/
├── app/
│   ├── page.tsx                    # Home page (latest report)
│   ├── blog/
│   │   └── [week]/
│   │       └── page.tsx            # Weekly report page
│   ├── api/
│   │   ├── subscribe/
│   │   │   └── route.ts            # Push notification subscription
│   │   └── notify/
│   │       └── route.ts            # Send notifications
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── NotificationButton.tsx      # Notification toggle component
├── lib/
│   └── reports.ts                  # Report utilities
├── scripts/
│   ├── generate-report.ts          # Report generation script
│   └── fetch-data.ts               # Data fetching logic
├── public/
│   ├── sw.js                       # Service Worker
│   └── icon-192.png                # Notification icon
├── reports/                        # Generated reports
│   ├── 2025-week-46.md
│   └── 2025-week-47.md
├── .github/
│   └── workflows/
│       └── weekly-report.yml       # Weekly automation
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

---

## 🔍 Data Fetching Script

### Step 4: Create scripts/fetch-data.ts

```typescript
import { Octokit } from "@octokit/rest"
import axios from "axios"
import * as cheerio from "cheerio"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

interface TrendingRepo {
  name: string
  url: string
  description: string
  starsThisWeek: number
}

interface Library {
  name: string
  url: string
  description: string
  category: string
}

interface RepoDetails {
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

interface WeeklyData {
  trending: TrendingRepo[]
  awesomeUpdates: Library[]
  generatedAt: string
}

// Fetch GitHub trending repositories
export async function fetchGitHubTrending(): Promise<TrendingRepo[]> {
  const response = await axios.get(
    "https://github.com/trending/typescript?since=weekly"
  )

  const $ = cheerio.load(response.data)
  const repos: TrendingRepo[] = []

  $("article.Box-row").each((_, element) => {
    const $el = $(element)
    const name = $el.find("h2 a").text().trim().replace(/\s+/g, "")
    const description = $el.find("p").text().trim()
    const starsText = $el.find("span.float-sm-right").text().trim()
    const stars = parseInt(starsText.replace(/,/g, "")) || 0

    if (name.includes("/")) {
      repos.push({
        name,
        url: `https://github.com/${name}`,
        description,
        starsThisWeek: stars,
      })
    }
  })

  return repos
}

// Fetch awesome-react updates
export async function fetchAwesomeReactUpdates(): Promise<Library[]> {
  const { data } = await octokit.repos.getContent({
    owner: "enaqx",
    repo: "awesome-react",
    path: "README.md",
  })

  if ("content" in data) {
    const content = Buffer.from(data.content, "base64").toString()
    const libraries = parseAwesomeReact(content)

    // Return latest 10 entries
    return libraries.slice(0, 10)
  }

  return []
}

// Get detailed repository information
export async function fetchRepoDetails(
  owner: string,
  repo: string
): Promise<RepoDetails> {
  const { data } = await octokit.repos.get({ owner, repo })

  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    updatedAt: data.updated_at,
    url: data.html_url,
    homepage: data.homepage,
  }
}

// Fetch npm weekly downloads
export async function fetchNpmDownloads(
  packageName: string
): Promise<number | null> {
  try {
    const response = await axios.get(
      `https://api.npmjs.org/downloads/point/last-week/${packageName}`
    )
    return response.data.downloads
  } catch {
    return null
  }
}

// Parse awesome-react markdown
function parseAwesomeReact(markdown: string): Library[] {
  const libraries: Library[] = []
  const lines = markdown.split("\n")

  let currentCategory = ""

  for (const line of lines) {
    // Detect category headers
    if (line.startsWith("### ")) {
      currentCategory = line.replace("### ", "").trim()
    }

    // Detect library links
    const match = line.match(/\[([^\]]+)\]\(([^)]+)\)\s*-\s*(.+)/)
    if (match) {
      const [, name, url, description] = match
      libraries.push({
        name,
        url,
        description,
        category: currentCategory,
      })
    }
  }

  return libraries
}

// Aggregate weekly data from all sources
export async function fetchWeeklyData(): Promise<WeeklyData> {
  console.log("📊 Fetching weekly data...")

  const [trending, awesomeUpdates] = await Promise.all([
    fetchGitHubTrending(),
    fetchAwesomeReactUpdates(),
  ])

  // Filter React-related repositories
  const reactRepos = trending.filter(
    (repo) =>
      repo.description?.toLowerCase().includes("react") ||
      repo.name.toLowerCase().includes("react")
  )

  return {
    trending: reactRepos.slice(0, 10),
    awesomeUpdates: awesomeUpdates.slice(0, 10),
    generatedAt: new Date().toISOString(),
  }
}
```

---

## 📝 Report Generation Script

### Step 5: Create scripts/generate-report.ts

```typescript
import {
  fetchWeeklyData,
  fetchRepoDetails,
  fetchNpmDownloads,
} from "./fetch-data"
import { format } from "date-fns"
import fs from "fs/promises"
import path from "path"

interface TrendingRepo {
  name: string
  url: string
  description: string
  starsThisWeek: number
}

interface Library {
  name: string
  url: string
  description: string
  category: string
}

async function generateWeeklyReport() {
  const weekNumber = format(new Date(), "yyyy-'week'-II")
  const data = await fetchWeeklyData()

  // Generate report content
  const markdown = `---
title: "React Weekly Trends - ${format(new Date(), "MMMM dd, yyyy")}"
week: "${weekNumber}"
date: "${new Date().toISOString()}"
---

# 🔥 React Weekly Trends

> Weekly report for ${format(new Date(), "MMMM dd, yyyy")}

## 📈 Trending Repositories This Week

${await generateTrendingSection(data.trending)}

## 🆕 New Libraries in awesome-react

${generateAwesomeSection(data.awesomeUpdates)}

## 📊 Weekly Highlights

${await generateInsights(data)}

---

*This report is automatically generated*
`

  // Save report file
  const reportsDir = path.join(process.cwd(), "reports")
  await fs.mkdir(reportsDir, { recursive: true })

  const filePath = path.join(reportsDir, `${weekNumber}.md`)
  await fs.writeFile(filePath, markdown, "utf-8")

  console.log(`✅ Report generated: ${filePath}`)

  return { weekNumber, filePath }
}

async function generateTrendingSection(
  trending: TrendingRepo[]
): Promise<string> {
  const sections = await Promise.all(
    trending.map(async (repo, index) => {
      const [owner, name] = repo.name.split("/")

      try {
        const details = await fetchRepoDetails(owner, name)
        const downloads = await fetchNpmDownloads(name)

        return `
### ${index + 1}. [${repo.name}](${repo.url}) ⭐ ${details.stars.toLocaleString()}

${repo.description || details.description}

- 🌟 **Stars This Week**: ${repo.starsThisWeek.toLocaleString()}
- 📦 **npm Weekly Downloads**: ${downloads ? downloads.toLocaleString() : "N/A"}
- 💻 **Language**: ${details.language}
- 🔗 **Website**: ${details.homepage || "N/A"}
`
      } catch (error) {
        return `
### ${index + 1}. [${repo.name}](${repo.url)}

${repo.description}

- 🌟 **Stars This Week**: ${repo.starsThisWeek.toLocaleString()}
`
      }
    })
  )

  return sections.join("\n")
}

function generateAwesomeSection(updates: Library[]): string {
  return updates
    .map(
      (lib, index) => `
### ${index + 1}. [${lib.name}](${lib.url})

${lib.description}

**Category**: ${lib.category}
`
    )
    .join("\n")
}

async function generateInsights(data: {
  trending: TrendingRepo[]
  awesomeUpdates: Library[]
}): Promise<string> {
  // Calculate basic statistics
  const totalStars = data.trending.reduce(
    (sum, repo) => sum + (repo.starsThisWeek || 0),
    0
  )

  return `
- React-related repos that trended this week: **${data.trending.length}**
- Total stars gained: **${totalStars.toLocaleString()}**
- New entries in awesome-react: **${data.awesomeUpdates.length}**

### 🔥 Hot Topics

${analyzeTrends(data)}
`
}

function analyzeTrends(data: {
  awesomeUpdates: Library[]
}): string {
  const categories = data.awesomeUpdates.reduce((acc: Record<string, number>, lib) => {
    acc[lib.category] = (acc[lib.category] || 0) + 1
    return acc
  }, {})

  const topCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return topCategories
    .map(([category, count]) => `- **${category}**: ${count} new libraries`)
    .join("\n")
}

// Execute
generateWeeklyReport()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error)
    process.exit(1)
  })
```

---

## ⚙️ GitHub Actions Configuration

### Step 6: Create .github/workflows/weekly-report.yml

```yaml
name: Generate Weekly React Trends Report

on:
  schedule:
    # Every Sunday at 00:00 UTC (Monday 9:00 JST)
    - cron: '0 0 * * 0'
  workflow_dispatch: # Allow manual trigger

jobs:
  generate-report:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Generate weekly report
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npm run generate-report

      - name: Commit and push report
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add reports/*.md
          git commit -m "📊 Add weekly report $(date +'%Y-week-%V')" || exit 0
          git push

      - name: Trigger Vercel deployment
        if: success()
        run: |
          curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK }}

      - name: Send push notifications
        if: success()
        run: |
          curl -X POST https://react-weekly-trends.vercel.app/api/notify
```

---

## 🌐 Next.js Pages Implementation

### Step 7: Create Next.js Pages

#### app/page.tsx

```typescript
import { getAllReports, getLatestReport } from "@/lib/reports"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { NotificationButton } from "@/components/NotificationButton"

export default async function Home() {
  const latestReport = await getLatestReport()
  const allReports = await getAllReports()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ⚛️ React Weekly Trends
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Automatically updated React ecosystem trend reports every week
          </p>
          <NotificationButton />
        </header>

        {/* Latest Report */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                📰 Latest Report
              </h2>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(latestReport.date), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <Link
              href={`/blog/${latestReport.week}`}
              className="block hover:bg-gray-50 p-6 rounded-lg transition-colors"
            >
              <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                {latestReport.title}
              </h3>
              <p className="text-gray-600 mb-4">{latestReport.excerpt}</p>
              <span className="text-blue-500 font-medium">
                Read report →
              </span>
            </Link>
          </div>
        </section>

        {/* Past Reports Archive */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            📚 Past Reports
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allReports.slice(1).map((report) => (
              <Link
                key={report.week}
                href={`/blog/${report.week}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {report.excerpt}
                </p>
                <span className="text-sm text-blue-500">
                  {new Date(report.date).toLocaleDateString("en-US")}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
```

#### app/blog/[week]/page.tsx

```typescript
import { getReportByWeek, getAllReports } from "@/lib/reports"
import { marked } from "marked"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const reports = await getAllReports()
  return reports.map((report) => ({
    week: report.week,
  }))
}

export default async function BlogPost({
  params,
}: {
  params: { week: string }
}) {
  const report = await getReportByWeek(params.week)

  if (!report) {
    notFound()
  }

  const htmlContent = marked(report.content)

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {report.title}
          </h1>
          <div className="flex items-center text-gray-600 text-sm">
            <time dateTime={report.date}>
              {new Date(report.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  )
}
```

---

## 🔔 Push Notifications Setup

### Step 8: Implement Push Notifications

#### app/api/subscribe/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

// Configure VAPID keys
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()

    // Save subscription (in production, use a database)
    const fs = require("fs/promises")
    const subscriptionsPath = "./subscriptions.json"

    let subscriptions = []
    try {
      const data = await fs.readFile(subscriptionsPath, "utf-8")
      subscriptions = JSON.parse(data)
    } catch {
      // File doesn't exist yet
    }

    subscriptions.push(subscription)
    await fs.writeFile(
      subscriptionsPath,
      JSON.stringify(subscriptions, null, 2)
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    )
  }
}
```

#### app/api/notify/route.ts

```typescript
import { NextResponse } from "next/server"
import webpush from "web-push"

export async function POST() {
  try {
    const fs = require("fs/promises")
    const subscriptions = JSON.parse(
      await fs.readFile("./subscriptions.json", "utf-8")
    )

    const payload = JSON.stringify({
      title: "🔥 New React Weekly Trends Published!",
      body: "Check out this week's trending React libraries",
      icon: "/icon-192.png",
      url: "/",
    })

    await Promise.all(
      subscriptions.map((subscription: any) =>
        webpush.sendNotification(subscription, payload).catch((err) => {
          console.error("Notification error:", err)
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    )
  }
}
```

#### public/sw.js

```javascript
self.addEventListener("push", (event) => {
  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: { url: data.url },
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
```

#### components/NotificationButton.tsx

```typescript
"use client"

import { useState } from "react"

export function NotificationButton() {
  const [subscribed, setSubscribed] = useState(false)

  async function subscribe() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser")
      return
    }

    try {
      // Register Service Worker
      const registration = await navigator.serviceWorker.register("/sw.js")

      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        alert("Notification permission was denied")
        return
      }

      // Create subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      // Send to server
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })

      setSubscribed(true)
      alert("🔔 Notifications enabled!")
    } catch (error) {
      console.error("Subscription failed:", error)
      alert("Failed to enable notifications")
    }
  }

  return (
    <button
      onClick={subscribe}
      disabled={subscribed}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
      {subscribed ? "🔔 Notifications ON" : "🔔 Get Notifications"}
    </button>
  )
}
```

---

## 🛠️ Utility Functions

### Step 9: Create lib/reports.ts

```typescript
import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

const reportsDirectory = path.join(process.cwd(), "reports")

interface Report {
  week: string
  title: string
  date: string
  excerpt: string
}

interface ReportWithContent extends Report {
  content: string
}

export async function getAllReports(): Promise<Report[]> {
  const fileNames = await fs.readdir(reportsDirectory)

  const reports = await Promise.all(
    fileNames
      .filter((name) => name.endsWith(".md"))
      .map(async (fileName) => {
        const filePath = path.join(reportsDirectory, fileName)
        const fileContents = await fs.readFile(filePath, "utf-8")
        const { data, content } = matter(fileContents)

        return {
          week: fileName.replace(/\.md$/, ""),
          title: data.title,
          date: data.date,
          excerpt: content.slice(0, 150) + "...",
        }
      })
  )

  return reports.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getLatestReport(): Promise<Report> {
  const reports = await getAllReports()
  return reports[0]
}

export async function getReportByWeek(
  week: string
): Promise<ReportWithContent | null> {
  try {
    const filePath = path.join(reportsDirectory, `${week}.md`)
    const fileContents = await fs.readFile(filePath, "utf-8")
    const { data, content } = matter(fileContents)

    return {
      week,
      title: data.title,
      date: data.date,
      content,
      excerpt: "",
    }
  } catch {
    return null
  }
}
```

---

## 🚀 Deployment Guide

### Step 10: Deploy to Production

#### 1. Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

Save the output - you'll need both the public and private keys.

#### 2. Configure Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key-here
VAPID_PRIVATE_KEY=your-private-key-here
GITHUB_TOKEN=your-github-token-here
```

**For Vercel deployment**, add these as environment variables in your Vercel project settings.

#### 3. Create Notification Icon

Create a 192x192 PNG image and save it as `public/icon-192.png`.

#### 4. Initial Build and Lint

```bash
# Format code with eslint-config-ts-prefixer
npm run lint:fix

# Type check
npm run type-check

# Build
npm run build
```

#### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### 6. Configure GitHub Secrets

In your GitHub repository settings, go to **Settings > Secrets and variables > Actions** and add:

- `VERCEL_DEPLOY_HOOK`: Your Vercel deploy hook URL
  - Get this from: Vercel Dashboard > Project > Settings > Git > Deploy Hooks

#### 7. Create Initial Report (Optional)

```bash
# Manually trigger the first report
npm run generate-report
```

---

## 📋 Usage & Maintenance

### Running Locally

```bash
# Start development server
npm run dev

# Generate a report manually
npm run generate-report

# Lint and fix code
npm run lint:fix
```

### Manual Workflow Trigger

You can manually trigger the weekly report generation:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Generate Weekly React Trends Report**
4. Click **Run workflow**

### Monitoring

- **GitHub Actions**: Check the Actions tab for workflow runs
- **Vercel Dashboard**: Monitor deployments and logs
- **Browser DevTools**: Check Service Worker status in Application tab

### Customization

#### Change Report Schedule

Edit `.github/workflows/weekly-report.yml`:

```yaml
schedule:
  # Change this cron expression
  - cron: '0 0 * * 0'  # Every Sunday at midnight UTC
```

#### Modify Report Content

Edit `scripts/generate-report.ts` to customize:
- Report sections
- Data sources
- Markdown formatting
- Statistics calculation

#### Update Styling

Edit `app/globals.css` or modify Tailwind classes in components.

#### Add New Data Sources

Extend `scripts/fetch-data.ts` with new functions to fetch data from:
- npm trends
- Stack Overflow
- Reddit
- Dev.to
- etc.

---

## 🐛 Troubleshooting

### Issue: GitHub Actions failing

**Solution**: Check that:
- `GITHUB_TOKEN` has proper permissions
- All dependencies are in `package.json`
- TypeScript compiles without errors

### Issue: Notifications not working

**Solution**: 
- Verify VAPID keys are correctly set
- Check browser console for Service Worker errors
- Ensure HTTPS is enabled (required for notifications)

### Issue: Reports not generating

**Solution**:
- Check GitHub API rate limits
- Verify `scripts/generate-report.ts` runs locally
- Check for network issues or API changes

---

## 🎉 Conclusion

You now have a fully automated React Weekly Trends blog that:

✅ Generates reports every week  
✅ Displays beautiful reports with Next.js  
✅ Sends desktop push notifications  
✅ Uses proper TypeScript and ESLint configuration  
✅ Automatically deploys to Vercel  

### Next Steps

1. Customize the design to match your brand
2. Add more data sources
3. Implement analytics tracking
4. Add RSS feed support
5. Create social media sharing features

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [eslint-config-ts-prefixer](https://github.com/laststance/eslint-config-ts-prefixer)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)

---

**Built with ❤️ using Next.js 16, TypeScript, and Tailwind CSS**
