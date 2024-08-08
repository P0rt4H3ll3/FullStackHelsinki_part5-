const loginWith = async (page, username, password) => {
  const userTextbox = await page.getByTestId('username')
  const passTextbox = await page.getByTestId('password')
  await userTextbox.fill(username)
  await passTextbox.fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('blog-title').fill(title)
  await page.getByTestId('blog-author').fill(author)
  await page.getByTestId('blog-url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, createBlog }
