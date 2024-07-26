const Notification = ({ message }) => {
  if (message === null) return null
  return message.includes('Error') ? (
    <div className="error">{message}</div>
  ) : (
    <div className="success">{message}</div>
  )
}

export default Notification
