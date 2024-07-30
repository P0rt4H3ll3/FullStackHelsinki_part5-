import { useState } from 'react'

const Blog = ({ blog, transferIdToParent, username, transferIdToDelete }) => {
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

  const deleteHandler = () => {
    if (window.confirm(`Remove Blog: ${blog.title} by ${blog.author}`)) {
      transferIdToDelete(blog.id)
    }
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
          {blog.user.username === username ? (
            <div>
              <button
                onClick={deleteHandler}
                className="deleteButton"
                style={{
                  backgroundColor: 'dodgerblue',
                  color: 'black',
                  border: 'none',
                  margin: '2px',
                  padding: '2px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                remove
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default Blog
