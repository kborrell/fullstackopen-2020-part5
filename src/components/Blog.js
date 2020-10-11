import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, handleLikeBlog, handleRemoveBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    paddingBottom: 10
  }

  const [detailsVisible, setDetailsVisible] = useState(false)
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }
  const showWhenBlogOwned = { display: user.username === blog.user.username ? '' : 'none' }

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const likeBlog = () => {
    handleLikeBlog(blog)
  }

  const removeBlog = () => {
    handleRemoveBlog(blog)
  }

  return (
    <div style={ blogStyle }>
      {blog.title} {blog.author} <button onClick={ toggleDetails }>{ detailsVisible ? 'hide' : 'view' }</button>
      <div style={ showWhenVisible }>
        <p>{ blog.url }</p>
        <p>likes { blog.likes } <button onClick={ likeBlog }>like</button></p>
        <p>{ blog.user.name}</p>
        <div style={ showWhenBlogOwned }>
          <button onClick={ removeBlog }>remove</button>
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  }),
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  }),
  handleLikeBlog: PropTypes.func.isRequired,
  handleRemoveBlog: PropTypes.func.isRequired
}

export default Blog
