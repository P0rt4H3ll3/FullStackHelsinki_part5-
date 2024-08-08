const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog App Test', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByText('Log into BlogApp:')).toBeVisible()
  })
})
