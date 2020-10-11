import React, { useState } from 'react'

const CreateBlog = React.forwardRef(({ handleCreateBlog }, ref) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleOnSubmit = async (event) => {
    event.preventDefault()
    const blog = { title, author, url }
    const succeed = await handleCreateBlog(blog)
    if (succeed) {
      ref.current.toggleVisibility()
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
})

export default CreateBlog
