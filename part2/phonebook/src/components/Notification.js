import React from 'react'

const Notification = (props) => {
  const { message, messageType } = props
    if (message === null) {
    return null
  }

  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

export default Notification