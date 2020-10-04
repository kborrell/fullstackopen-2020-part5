import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

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

const BlogList = ({ blogs }) => {
  return (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

const CreateBlog = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleOnSubmit = async (event) => {
    event.preventDefault()
    const blog = { title, author, url }
    const succeed = await handleCreateBlog(blog)
    if (succeed) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleOnSubmit}>
        <div>title <input type="text" value={title} name="Title" onChange={ ({ target }) => setTitle(target.value) } /></div>
        <div>author <input type="text" value={author} name="Author" onChange={ ({ target }) => setAuthor(target.value) } /></div>
        <div>url <input type="text" value={url} name="Url" onChange={ ({ target }) => setUrl(target.value) } /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const Blogs = ({ blogs, user, handleLogout, handleCreateBlog }) => {
  return (
    <div>
      <LoggedIn user={ user } handleLogout={ handleLogout } />
      <CreateBlog handleCreateBlog={ handleCreateBlog } />
      <BlogList blogs={ blogs }/>
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

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
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
    setBlogs(blogs.concat(createdBlog))
    setInfoMessage({ message: `${blog.title} by ${blog.author} added`, isError: false })
    setTimeout(() => setInfoMessage(undefined), 5000)
    return true
  }

  if (user) {
    return (
      <div>
        <h2>blogs</h2>
        { infoMessage && <Message message={ infoMessage } /> }
        <Blogs blogs={ blogs } user={ user } handleLogout={ handleLogout } handleCreateBlog={ handleCreateBlog } setInfoMessage={ (message) => setInfoMessage(message) } /> 
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