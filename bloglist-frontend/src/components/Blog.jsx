import { useState } from 'react'

const Blog = ({ blog, transferIdToParent }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateLikeHandler = () => {
    transferIdToParent({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id
    })
  }

  return (
    <div style={blogStyle}>
      {' '}
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible ? (
        <div>
          <div>{blog.url}</div>
          <div>
            {blog.likes}
            <button onClick={updateLikeHandler}>likes</button>
          </div>
          <div>{blog.user.name}</div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default Blog
