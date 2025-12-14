import { getReports, getLatestReport } from '@/lib/reports'
import { formatDate } from '@/lib/markdown'
import Link from 'next/link'
import SubscriptionButton from '@/components/SubscriptionButton'

/**
 * Home displays the landing page with the latest report and archive.
 */
export default function Home() {
  const latestReport = getLatestReport()
  const allReports = getReports()
  const archiveReports = allReports.slice(1, 4) // Show 3 previous reports

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              <span className="text-gradient">React Weekly Trends</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl">
              Stay updated with the latest trends, libraries, and insights from
              the React ecosystem. Curated weekly for developers.
            </p>
            <div className="mt-10">
              <SubscriptionButton />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Report Section */}
      {latestReport && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                Latest Report
              </h2>
              <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-white">
                New
              </span>
            </div>

            <Link
              href={`/blog/${latestReport.week}`}
              className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] transition-all hover:border-[var(--accent)] hover:shadow-lg"
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(latestReport.date)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)] sm:text-2xl lg:text-3xl">
                  {latestReport.title}
                </h3>
                <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                  {latestReport.excerpt}
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 font-medium text-[var(--accent)] transition-transform group-hover:translate-x-1">
                    Read Full Report
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Archive Section */}
      {archiveReports.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="mb-8 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              Previous Reports
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {archiveReports.map((report) => (
                <Link
                  key={report.week}
                  href={`/blog/${report.week}`}
                  className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 transition-all hover:border-[var(--accent)] hover:shadow-md"
                >
                  <span className="text-sm font-medium text-[var(--accent)]">
                    {formatDate(report.date)}
                  </span>
                  <h3 className="mt-2 font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                    {report.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
                    {report.excerpt}
                  </p>
                </Link>
              ))}
            </div>

            {allReports.length > 4 && (
              <div className="mt-10 text-center">
                <Link
                  href="/archive"
                  className="btn-secondary inline-block"
                >
                  View All Reports
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            What You&apos;ll Discover
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center transition-all hover:shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-muted)] text-2xl">
                🔥
              </div>
              <h3 className="mb-2 font-bold text-[var(--text-primary)]">
                Trending Repositories
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Discover the most popular React projects and libraries gaining
                traction this week.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center transition-all hover:shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-muted)] text-2xl">
                📈
              </div>
              <h3 className="mb-2 font-bold text-[var(--text-primary)]">
                Weekly Insights
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Get comprehensive analysis of trends, updates, and community
                developments.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center transition-all hover:shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-muted)] text-2xl">
                📰
              </div>
              <h3 className="mb-2 font-bold text-[var(--text-primary)]">
                Stay Updated
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
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
