import { useState } from 'react'

const LoginForm = ({ transferLoginToParent }) => {
  const [username, setUsername] = useState([''])
  const [password, setPassword] = useState([''])

  const handleSubmit = (event) => {
    event.preventDefault()
    transferLoginToParent(username, password)
    setPassword('')
    setUsername('')
  }

  return (
    <>
      <h2>Log into BlogApp:</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm
