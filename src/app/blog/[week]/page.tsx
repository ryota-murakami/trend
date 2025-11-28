import { getReportByWeek, getReports } from '@/lib/reports'
import { renderMarkdown, formatDate } from '@/lib/markdown'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    week: string
  }
}

export async function generateStaticParams() {
  const reports = getReports()
  return reports.map((report) => ({
    week: report.week
  }))
}

export default function ReportPage({ params }: Props) {
  const report = getReportByWeek(params.week)
  
  if (!report) {
    notFound()
  }
  
  const contentHtml = renderMarkdown(report.content)
  const allReports = getReports()
  const currentIndex = allReports.findIndex(r => r.week === report.week)
  const previousReport = currentIndex < allReports.length - 1 ? allReports[currentIndex + 1] : null
  const nextReport = currentIndex > 0 ? allReports[currentIndex - 1] : null
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Report Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-4">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
          <div className="mb-2 text-sm text-blue-600">
            {formatDate(report.date)}
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            {report.title}
          </h1>
        </div>
      </section>
      
      {/* Report Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <article 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </section>
      
      {/* Navigation */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              {previousReport && (
                <Link 
                  href={`/blog/${previousReport.week}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Previous: {previousReport.title}
                </Link>
              )}
            </div>
            <div>
              {nextReport && (
                <Link 
                  href={`/blog/${nextReport.week}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Next: {nextReport.title} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}