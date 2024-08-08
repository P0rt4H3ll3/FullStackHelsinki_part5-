const loginWith = async (page, username, password) => {
  const userTextbox = await page.getByTestId('username')
  const passTextbox = await page.getByTestId('password')
  await userTextbox.fill(username)
  await passTextbox.fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export { loginWith }
