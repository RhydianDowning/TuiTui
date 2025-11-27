import { test, expect } from '@playwright/test'

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  test('should display settings page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Settings')
  })

  test('should display notification settings section', async ({ page }) => {
    await expect(page.locator('text=Notification Settings')).toBeVisible()
    await expect(page.locator('text=Enable notifications')).toBeVisible()
  })

  test('should toggle notifications switch', async ({ page }) => {
    const switchButton = page.locator('#notifications')
    await switchButton.click()
    await expect(switchButton).toBeChecked()
    await switchButton.click()
    await expect(switchButton).not.toBeChecked()
  })

  test('should display TuiTui Markdown section', async ({ page }) => {
    await expect(page.locator('text=TuiTui Markdown')).toBeVisible()
    await expect(page.locator('text=Upload Markdown File')).toBeVisible()
  })

  test('should have markdown file upload input', async ({ page }) => {
    const fileInput = page.locator('#markdown-file')
    await expect(fileInput).toBeVisible()
    await expect(fileInput).toHaveAttribute('accept', '.md')
  })

  test('should show no markdown file uploaded initially', async ({ page }) => {
    await expect(page.locator('text=No markdown file uploaded')).toBeVisible()
  })

  test('should display Team Settings section', async ({ page }) => {
    await expect(page.locator('text=Team Settings')).toBeVisible()
    await expect(page.locator('text=Select Team')).toBeVisible()
  })

  test('should have team select dropdown', async ({ page }) => {
    const selectTrigger = page.locator('button:has-text("Choose a team")')
    await expect(selectTrigger).toBeVisible()
  })

  test('should open team dropdown and show options', async ({ page }) => {
    await page.click('button:has-text("Choose a team")')
    await expect(page.locator('[role="option"]:has-text("Syntax Swing")')).toBeVisible()
    await expect(page.locator('[role="option"]:has-text("Marvels")')).toBeVisible()
    await expect(page.locator('[role="option"]:has-text("Add New Team")')).toBeVisible()
  })

  test('should select a team from dropdown', async ({ page }) => {
    await page.click('button:has-text("Choose a team")')
    await page.click('[role="option"]:has-text("Syntax Swing")')
    await expect(page.locator('text=Team selected: Syntax Swing')).toBeVisible()
  })

  test('should show View Team Information button when team is selected', async ({ page }) => {
    await page.click('button:has-text("Choose a team")')
    await page.click('[role="option"]:has-text("Syntax Swing")')
    await expect(page.locator('button:has-text("View Team Information")')).toBeVisible()
  })

  test('should show add new team input when Add New Team is selected', async ({ page }) => {
    await page.click('button:has-text("Choose a team")')
    await page.click('[role="option"]:has-text("Add New Team")')
    await expect(page.locator('#new-team-name')).toBeVisible()
    await expect(page.locator('button:has-text("Add Team")')).toBeVisible()
  })

  test('should add a new team', async ({ page }) => {
    await page.click('button:has-text("Choose a team")')
    await page.click('[role="option"]:has-text("Add New Team")')
    await page.fill('#new-team-name', 'New Test Team')
    await page.click('button:has-text("Add Team")')
    await page.click('button:has-text("Choose a team")')
    await page.click('[role="option"]:has-text("New Test Team")')
    await expect(page.locator('text=Team selected: New Test Team')).toBeVisible()
  })

  test('should have Save Settings button', async ({ page }) => {
    await expect(page.locator('button:has-text("Save Settings")')).toBeVisible()
  })

  test('should have Back to TuiTui link', async ({ page }) => {
    await expect(page.locator('a[href="/tuitui"]')).toBeVisible()
    await expect(page.locator('button:has-text("Back to TuiTui")')).toBeVisible()
  })

  test('should navigate back to TuiTui', async ({ page }) => {
    await page.click('a[href="/tuitui"]')
    await expect(page).toHaveURL('/tuitui')
  })

  test('should save settings and show confirmation', async ({ page }) => {
    await page.click('button:has-text("Save Settings")')
    await expect(page.locator('text=Settings saved!')).toBeVisible()
  })

  test('should persist settings in localStorage', async ({ page }) => {
    await page.click('button:has-text("Choose a team")')
    await page.click('[role="option"]:has-text("Marvels")')
    await page.click('button:has-text("Save Settings")')

    const settings = await page.evaluate(() => localStorage.getItem('tuitui-settings'))
    expect(settings).toContain('Marvels')
  })
})
