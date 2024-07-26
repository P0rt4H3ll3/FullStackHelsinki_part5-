const Blog = ({ blog }) => (
  <div>
    <table className="blog-table">
      <tbody>
        <tr>
          <td>{blog.title}</td>
          <td>{blog.author}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

export default Blog
