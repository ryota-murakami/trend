import { getReportByWeek, getReports } from '@/lib/reports'
import { renderMarkdown, formatDate } from '@/lib/markdown'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Params {
  week: string
}

export async function generateStaticParams() {
  const reports = getReports()
  return reports.map((report) => ({
    week: report.week,
  }))
}

/**
 * ReportPage displays a single weekly trend report with improved
 * typography and spacing for optimal readability.
 */
export default async function ReportPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { week } = await params
  const report = getReportByWeek(week)

  if (!report) {
    notFound()
  }

  const contentHtml = renderMarkdown(report.content)
  const allReports = getReports()
  const currentIndex = allReports.findIndex((r) => r.week === report.week)
  const previousReport =
    currentIndex < allReports.length - 1 ? allReports[currentIndex + 1] : null
  const nextReport = currentIndex > 0 ? allReports[currentIndex - 1] : null

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Article Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </nav>

          {/* Date Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-muted)] px-3 py-1 text-sm font-medium text-[var(--accent)]">
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
              {formatDate(report.date)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            {report.title}
          </h1>

          {/* Excerpt */}
          {report.excerpt && (
            <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
              {report.excerpt}
            </p>
          )}
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </article>

      {/* Navigation Between Reports */}
      <nav className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Previous Report */}
            <div>
              {previousReport ? (
                <Link
                  href={`/blog/${previousReport.week}`}
                  className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-md"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    ← Previous
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                    {previousReport.title}
                  </span>
                </Link>
              ) : (
                <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-tertiary)] p-4 opacity-50">
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    ← Previous
                  </span>
                  <span className="mt-1 block text-sm text-[var(--text-muted)]">
                    No previous report
                  </span>
                </div>
              )}
            </div>

            {/* Next Report */}
            <div className="text-right">
              {nextReport ? (
                <Link
                  href={`/blog/${nextReport.week}`}
                  className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-md"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Next →
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                    {nextReport.title}
                  </span>
                </Link>
              ) : (
                <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-tertiary)] p-4 opacity-50">
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Next →
                  </span>
                  <span className="mt-1 block text-sm text-[var(--text-muted)]">
                    No next report
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
