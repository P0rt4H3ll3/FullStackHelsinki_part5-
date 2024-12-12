const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  const userTextbox = await page.getByTestId('username')
  const passTextbox = await page.getByTestId('password')
  await userTextbox.fill(username)
  await passTextbox.fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const logoutWith = async (page, name) => {
  await expect(page.getByText(`${name} logged in`)).toBeVisible()
  await page.getByRole('button', { name: 'logout' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('blog-title').fill(title)
  await page.getByTestId('blog-author').fill(author)
  await page.getByTestId('blog-url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  await page.waitForSelector('.blog')

  await page
    .locator('.blog')
    .filter({ hasText: `${title}` })
    .waitFor()

  //await page.getByText(`new blog ${title} by ${author} added`).waitFor()
}

const likeABlog = async (page, title, numberOfLikes) => {
  const blog = await page.locator('.blog').filter({ hasText: title })

  await blog.getByRole('button', { name: 'view' }).click()

  for (let i = 0; i < numberOfLikes; i++) {
    await blog.getByRole('button', { name: 'like' }).click()
    await blog.getByText(`likes: ${i + 1}`).waitFor()
    await page.waitForTimeout(500)
  }

  await expect(blog.getByText(`likes: ${numberOfLikes}`)).toBeVisible()
  await expect(blog.getByText('likes: 0')).not.toBeVisible()
}

export { loginWith, createBlog, logoutWith, likeABlog }
