import { test, expect } from '@playwright/test'

test.describe('TuiTui Chat Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tuitui')
  })

  test('should display the header with TuiTui title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('TuiTui')
    await expect(page.locator('text=Auxiliary Tasks Assistant')).toBeVisible()
  })

  test('should display welcome message when no messages', async ({ page }) => {
    await expect(page.locator('text=Welcome to TuiTui')).toBeVisible()
    await expect(page.locator('text=Send a message to get started!')).toBeVisible()
  })

  test('should have a message input field', async ({ page }) => {
    const input = page.locator('input[placeholder="Type your message..."]')
    await expect(input).toBeVisible()
  })

  test('should have send and attach buttons', async ({ page }) => {
    await expect(page.locator('button[title="Attach file"]')).toBeVisible()
    await expect(page.locator('button:has(svg)')).toHaveCount(3)
  })

  test('should have settings link in header', async ({ page }) => {
    const settingsLink = page.locator('a[href="/settings"]')
    await expect(settingsLink).toBeVisible()
  })

  test('should navigate to settings page', async ({ page }) => {
    await page.click('a[href="/settings"]')
    await expect(page).toHaveURL('/settings')
  })

  test('should show Sign In button when not authenticated', async ({ page }) => {
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
  })

  test('should open auth modal when clicking Sign In', async ({ page }) => {
    await page.click('button:has-text("Sign In")')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })

  test('should enable send button when text is entered', async ({ page }) => {
    const input = page.locator('input[placeholder="Type your message..."]')
    await input.fill('Hello')
    const sendButton = page.locator('button:has(svg)').last()
    await expect(sendButton).toBeEnabled()
  })

  test('should show auth modal when trying to send without authentication', async ({ page }) => {
    const input = page.locator('input[placeholder="Type your message..."]')
    await input.fill('Hello')
    await page.keyboard.press('Enter')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })
})
