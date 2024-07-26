import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification.jsx'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState([''])
  const [password, setPassword] = useState([''])
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(null)
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  }, [message])

  const createNewBlog = async (newBlogObject) => {
    try {
      const newBlog = await blogService.create(newBlogObject)

      setBlogs(blogs.concat(newBlog))
      setMessage(`new blog ${newBlog.title} by ${newBlog.author} added`)
    } catch (exception) {
      setMessage(
        `An Error Occured while creating a new blog:${exception.response.data.error}`
      )
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage(`logged in as ${user.username}`)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage(`Error : ${exception.response.data.error}`)
    }
    //user Username Phillip1 use password Password
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setMessage('logged out')
  }

  const handleCreate = (event) => {
    event.preventDefault()
    createNewBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  const loginForm = () => (
    <form onSubmit={handleLogin}>
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
  )

  const blogForm = () => (
    <form onSubmit={handleCreate}>
      <h2>Create a new Blog</h2>
      <table>
        <tbody>
          <tr>
            <td>title:</td>
            <td>
              <input
                type="text"
                name="title"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </td>
          </tr>

          <tr>
            <td>author:</td>
            <td>
              <input
                type="text"
                name="author"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              />
            </td>
          </tr>

          <tr>
            <td>url:</td>
            <td>
              <input
                type="text"
                name="url"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <h2>Logged in as:</h2>
      <Notification message={message} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
          <h2>Blogs:</h2>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
