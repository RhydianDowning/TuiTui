import { test, expect } from '@playwright/test'

test.describe('Registration Email Domain Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tuitui')
    await page.click('button:has-text("Sign In")')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.click('text=Don\'t have an account? Sign up')
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
  })

  test.only('should reject non-tui.co.uk email addresses', async ({ page }) => {
    await page.fill('input[placeholder="Enter your name"]', 'Test User')
    await page.fill('input[placeholder="Enter your email"]', 'test@gmail.com')
    await page.fill('input[placeholder="Enter your password"]', 'password123')
    await page.click('button:has-text("Create Account")')
    await expect(page.locator('text=Only @tui.co.uk email addresses are allowed')).toBeVisible()
  })

  test('should reject other company domains', async ({ page }) => {
    await page.fill('input[placeholder="Enter your name"]', 'Test User')
    await page.fill('input[placeholder="Enter your email"]', 'test@company.com')
    await page.fill('input[placeholder="Enter your password"]', 'password123')
    await page.click('button:has-text("Create Account")')
    await expect(page.locator('text=Only @tui.co.uk email addresses are allowed')).toBeVisible()
  })

  test('should reject similar domains like tui.com', async ({ page }) => {
    await page.fill('input[placeholder="Enter your name"]', 'Test User')
    await page.fill('input[placeholder="Enter your email"]', 'test@tui.com')
    await page.fill('input[placeholder="Enter your password"]', 'password123')
    await page.click('button:has-text("Create Account")')
    await expect(page.locator('text=Only @tui.co.uk email addresses are allowed')).toBeVisible()
  })

  test('should accept tui.co.uk email addresses', async ({ page }) => {
    await page.fill('input[placeholder="Enter your name"]', 'Test User')
    await page.fill('input[placeholder="Enter your email"]', 'test@tui.co.uk')
    await page.fill('input[placeholder="Enter your password"]', 'password123')
    await page.click('button:has-text("Create Account")')
    await expect(page.locator('text=Only @tui.co.uk email addresses are allowed')).not.toBeVisible()
  })

  test('should accept TUI.CO.UK email addresses (case insensitive)', async ({ page }) => {
    await page.fill('input[placeholder="Enter your name"]', 'Test User')
    await page.fill('input[placeholder="Enter your email"]', 'test@TUI.CO.UK')
    await page.fill('input[placeholder="Enter your password"]', 'password123')
    await page.click('button:has-text("Create Account")')
    await expect(page.locator('text=Only @tui.co.uk email addresses are allowed')).not.toBeVisible()
  })
})
