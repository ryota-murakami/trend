import { getReports, getLatestReport } from '@/lib/reports'
import { formatDate } from '@/lib/markdown'
import Link from 'next/link'
import SubscriptionButton from '@/components/SubscriptionButton'

export default function Home() {
  const latestReport = getLatestReport()
  const allReports = getReports()
  const archiveReports = allReports.slice(1, 4) // Show 3 previous reports

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            ⚛️ React Weekly Trends
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Stay updated with the latest trends, libraries, and insights from
            the React ecosystem
          </p>
          <SubscriptionButton />
        </div>
      </section>

      {/* Latest Report Section */}
      {latestReport && (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Latest Report
            </h2>
            <div className="overflow-hidden rounded-lg bg-white shadow-xl">
              <div className="p-8">
                <div className="mb-4 text-sm text-blue-600">
                  {formatDate(latestReport.date)}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {latestReport.title}
                </h3>
                <p className="mb-6 text-gray-600">{latestReport.excerpt}</p>
                <Link
                  href={`/blog/${latestReport.week}`}
                  className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Read Full Report →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Archive Section */}
      {archiveReports.length > 0 && (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Report Archive
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {archiveReports.map((report) => (
                <div
                  key={report.week}
                  className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="mb-2 text-sm text-blue-600">
                      {formatDate(report.date)}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                      {report.title}
                    </h3>
                    <p className="mb-4 text-gray-600">{report.excerpt}</p>
                    <Link
                      href={`/blog/${report.week}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {allReports.length > 4 && (
              <div className="mt-8 text-center">
                <Link
                  href="/archive"
                  className="inline-block rounded-lg bg-gray-200 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                >
                  View All Reports
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            What You&apos;ll Discover
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl">🔥</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Trending Repositories
              </h3>
              <p className="text-gray-600">
                Discover the most popular React projects and libraries gaining
                traction this week.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">📈</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Weekly Insights
              </h3>
              <p className="text-gray-600">
                Get comprehensive analysis of trends, updates, and community
                developments.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">📰</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Stay Updated
              </h3>
              <p className="text-gray-600">
                Never miss important updates with our automated weekly reports
                and notifications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
