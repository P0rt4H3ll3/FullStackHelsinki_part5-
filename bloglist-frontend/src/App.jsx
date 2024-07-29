import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification.jsx'
import BlogForm from './components/BlogForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    //user already logged in,
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
    blogFormRef.current.toggleVisibility() // creating a new blog, this toggles visibility
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

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage(`logged in as ${user.name}`)
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
  const loginForm = () => {
    return <LoginForm transferLoginToParent={handleLogin} />
  }

  const blogFormRef = useRef()
  const blogForm = () => {
    return (
      <Togglable buttonLable="new blog" ref={blogFormRef}>
        <BlogForm createNewBlog={createNewBlog} />
      </Togglable>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
