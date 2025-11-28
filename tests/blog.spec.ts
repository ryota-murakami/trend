import { test, expect } from '@playwright/test'

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

test('Homepage loads and shows latest report card', async ({ page }) => {
  const res = await page.goto(`${baseUrl}/`)
  expect(res?.status()).toBe(200)
  await expect(
    page.getByRole('heading', { name: '⚛️ React Weekly Trends' })
  ).toBeVisible()
})

test('Blog article renders for 2025-week-48', async ({ page }) => {
  const res = await page.goto(`${baseUrl}/blog/2025-week-48`)
  expect(res?.status()).toBe(200)
  await expect(page.locator('article')).toBeVisible()
  await expect(page.getByText('Report Not Found')).toHaveCount(0)
})
