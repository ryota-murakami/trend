import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Report, ReportFrontmatter } from '@/types'

const REPORTS_DIR = path.join(process.cwd(), 'reports')

export function getReports(): Report[] {
  try {
    const files = fs.readdirSync(REPORTS_DIR)
    const reports = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(REPORTS_DIR, file)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContents)
        
        const frontmatter = data as ReportFrontmatter
        const excerpt = content.slice(0, 200).replace(/[#*`]/g, '').trim() + '...'
        
        return {
          week: frontmatter.week,
          title: frontmatter.title,
          date: frontmatter.date,
          content,
          excerpt
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return reports
  } catch (error) {
    console.error('Error reading reports:', error)
    return []
  }
}

export function getLatestReport(): Report | null {
  const reports = getReports()
  return reports.length > 0 ? reports[0] : null
}

export function getReportByWeek(week: string): Report | null {
  const reports = getReports()
  return reports.find(report => report.week === week) || null
}

export function getReportContent(week: string): string | null {
  try {
    const filePath = path.join(REPORTS_DIR, `${week}.md`)
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { content } = matter(fileContents)
    return content
  } catch (error) {
    console.error('Error reading report content:', error)
    return null
  }
}