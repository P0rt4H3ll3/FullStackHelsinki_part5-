const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, logoutWith, likeABlog } = require('./helper')

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

    await request.post('/api/users', {
      data: {
        name: 'Second Tester',
        username: 'TestApprentice',
        password: 'PlayWright2'
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

    describe('when Logged in single user', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'TestMaster', 'PlayWright1')
      })
      test('logged in user can create a blog', async ({ page }) => {
        await createBlog(
          page,
          'Testing Title',
          'Testing Author',
          'https://playwright.dev/docs/api-testing'
        )

        const newBlog = page
          .locator('.blog')
          .filter({ hasText: 'Testing Title' })
        await expect(newBlog.getByText('Testing Title')).toBeVisible()
      })

      test('blog can be liked', async ({ page }) => {
        await createBlog(
          page,
          'Blog to be liked',
          'likeable author',
          'http://likeme.com'
        )
        await likeABlog(page, 'Blog to be liked', 2)

        await expect(page.getByText('likes: 2')).toBeVisible()
      })

      test('blog can be deleted', async ({ page }) => {
        await createBlog(
          page,
          'Blog to be deleted',
          'deletable author',
          'http://hateme.com'
        )
        const deleteBlog = await page
          .locator('.blog')
          .filter({ hasText: 'Blog to be deleted' })

        await deleteBlog.getByRole('button', { name: 'view' }).click()

        await expect(
          deleteBlog.getByRole('button', { name: 'remove' })
        ).toBeVisible()

        //playwright.dev/docs/dialogs has to be before the button is clicked
        page.on('dialog', (dialog) => dialog.accept())
        await deleteBlog.getByRole('button', { name: 'remove' }).click()

        await expect(
          deleteBlog.getByText('Blog to be deleted')
        ).not.toBeVisible()
        await expect(deleteBlog).not.toBeVisible()
      })
    })

    describe('Interaction between User contents', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'TestApprentice', 'PlayWright2')
        await createBlog(
          page,
          'Testing of Apprentice, please to not remove',
          'Testing Lecture',
          'https://playwright.dev/docs/api-testing'
        )
        await likeABlog(page, 'Testing of Apprentice, please to not remove', 1)
        await logoutWith(page, 'Second Tester')

        await loginWith(page, 'TestMaster', 'PlayWright1')
      })
      test('cannot delete Blogs from other users', async ({ page }) => {
        const otherBlog = await page
          .locator('.blog')
          .filter({ hasText: 'Testing of Apprentice, please to not remove' })
        await otherBlog.getByRole('button', { name: 'view' }).click()
        await expect(
          otherBlog.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })

      test('blogs are organized according to likes ', async ({ page }) => {
        await createBlog(
          page,
          'This is the 2nd Blog',
          'Testing Order',
          'https://playwright.dev/docs/api-testing'
        )

        await createBlog(
          page,
          'This is the top Blog',
          'Testing Order',
          'https://playwright.dev/docs/api-testing'
        )
        await likeABlog(page, 'This is the 2nd Blog', 2)
        await likeABlog(page, 'This is the top Blog', 3)

        const allBlogs = await page.locator('.blog').all()

        await expect(allBlogs[0]).toContainText('This is the top Blog')
        await expect(allBlogs[1]).toContainText('This is the 2nd Blog')
        await expect(allBlogs[2]).toContainText(
          'Testing of Apprentice, please to not remove'
        )
      })
    })
  })
})
