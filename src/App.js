import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import CreateBlog from './components/CreateBlog'
import Togglable from './components/Togglable'

const LogIn = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {
  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            username <input type="text" value={username} name="Username" onChange={handleUsernameChange} />
          </div>
          <div>
            password <input type="text" value={password} name="Password" onChange={handlePasswordChange} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    </div>
  )
}

const LoggedIn = ({ user, handleLogout }) => {
  return (
    <div>
      {user.name} logged in <button onClick={ handleLogout }>logout</button>
    </div>
  )
}

const BlogList = ({ blogs, user, handleLikeBlog, handleRemoveBlog }) => {
  return (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={ user } handleLikeBlog={ handleLikeBlog } handleRemoveBlog={ handleRemoveBlog } />
      )}
    </div>
  )
}

const Blogs = ({ blogs, user, handleLogout, handleCreateBlog, handleLikeBlog, handleRemoveBlog }) => {
  const blogFormRef = useRef()

  return (
    <div>
      <LoggedIn user={ user } handleLogout={ handleLogout } />
      <Togglable buttonLabel="new blog" ref={ blogFormRef }>
        <CreateBlog handleCreateBlog={ handleCreateBlog } ref={ blogFormRef } />
      </Togglable>
      <BlogList blogs={ blogs } user={ user } handleLikeBlog={ handleLikeBlog } handleRemoveBlog={ handleRemoveBlog }/>
    </div>
  )
}

const Message = ({ message }) => {
  return (
    <div className={message.isError ? "error" : "success"}>
      { message.message }
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(undefined)
  const [infoMessage, setInfoMessage] = useState(undefined)

  const sortBlogsByLikes = (a, b) => b.likes - a.likes

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      blogs.sort(sortBlogsByLikes)
      setBlogs(blogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
    } catch (exception) {
      setInfoMessage({ message: 'Wrong Credentials', isError: true })
      setTimeout(() => setInfoMessage(undefined), 5000)
    }
  }

  const handleLogout = () => {
    setInfoMessage({ message: `${user.name} logged out`, isError: false })
    setTimeout(() => setInfoMessage(undefined), 5000)
    window.localStorage.clear()
    setUser(undefined)
  }

  const handleCreateBlog = async (blog) => {
    const createdBlog = await blogService.create(blog)
    var newBlogs = blogs.concat(createdBlog).sort(sortBlogsByLikes)
    setBlogs(newBlogs)
    setInfoMessage({ message: `${blog.title} by ${blog.author} added`, isError: false })
    setTimeout(() => setInfoMessage(undefined), 5000)
    return true
  }

  const handleLikeBlog = async (blog) => {
    const updatedBlog = await blogService.like(blog)
    const newBlogs = blogs.map((b) => {
      if (b.id === updatedBlog.id) {
        b.likes = updatedBlog.likes
      }
      return b
    })
    setBlogs(newBlogs.sort(sortBlogsByLikes))
  }

  const handleRemoveBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
    {
      if (await blogService.remove(blog))
      {
        const newBlogs = blogs.filter((b) => b.id !== blog.id)
        setBlogs(newBlogs.sort(sortBlogsByLikes))
      }
    }
  }

  if (user) {
    return (
      <div>
        <h2>blogs</h2>
        { infoMessage && <Message message={ infoMessage } /> }
        <Blogs 
          blogs={ blogs } 
          user={ user } 
          handleLogout={ handleLogout } 
          handleCreateBlog={ handleCreateBlog } 
          handleLikeBlog={ handleLikeBlog } 
          handleRemoveBlog={ handleRemoveBlog }
          setInfoMessage={ (message) => setInfoMessage(message) } /> 
      </div>
    )
  } else {
    return (
      <div>
        <h2>log in to application</h2>
        { infoMessage && <Message message={ infoMessage } /> }
        <LogIn
          handleSubmit={handleLogin} 
          handleUsernameChange={ ({ target }) => setUsername(target.value) }
          handlePasswordChange={ ({ target }) => setPassword(target.value) }
          username={ username } 
          password={ password }
          setInfoMessage={ (message) => setInfoMessage(message) }
        />
      </div>
    )
  }
}

export default App