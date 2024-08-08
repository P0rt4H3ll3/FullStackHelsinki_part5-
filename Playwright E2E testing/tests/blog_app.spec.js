const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog App Test', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Tester Mctesti',
        username: 'TestMaster',
        password: 'PlayWright1'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByText('Log into BlogApp:')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const userTextbox = await page.getByTestId('username')
      const passTextbox = await page.getByTestId('password')
      await userTextbox.fill('TestMaster')
      await passTextbox.fill('PlayWright1')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Tester Mctesti logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const userTextbox = await page.getByTestId('username')
      const passTextbox = await page.getByTestId('password')
      await userTextbox.fill('TestMaster')
      await passTextbox.fill('DoNotTestAtAll')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Tester Mctesti logged in')).not.toBeVisible()
    })
  })
})
