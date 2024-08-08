const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
      await loginWith(page, 'TestMaster', 'PlayWright1')
      await expect(page.getByText('Tester Mctesti logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'TestMaster', 'DoNotTestAtAll')
      await expect(
        page.getByText('Error : invalid username or password')
      ).toBeVisible()
    })

    describe('when Logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'TestMaster', 'PlayWright1')
      })
      test('logged in user can create a blog', async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('blog-title').fill('Testing Title')
        await page.getByTestId('blog-author').fill('Testing Author')
        await page
          .getByTestId('blog-url')
          .fill('https://playwright.dev/docs/api-testing')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText('Testing Title')).toBeVisible
      })

      test('blog can be liked', async ({ page }) => {
        await createBlog(
          page,
          'Blog to be liked',
          'likeable author',
          'http://likeme.com'
        )
        const likeBlog = await page
          .locator('.blog')
          .filter({ hasText: 'Blog to be liked' })

        await likeBlog.getByRole('button', { name: 'view' }).click()

        await expect(likeBlog.getByText('likes: 0')).toBeVisible()
        await likeBlog.getByRole('button', { name: 'like' }).click()

        await expect(likeBlog.getByText('likes: 1')).toBeVisible()
        await expect(likeBlog.getByText('likes: 0')).not.toBeVisible()
      })
    })
  })
})
