import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import CreateBlog from './CreateBlog'

test('<CreateBlog calls submit handler with the correct input data', () => {
  const createBlogHandler = jest.fn()

  const component = render(
    <CreateBlog handleCreateBlog={ createBlogHandler } />
  )

  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, {
    target: { value: 'How to unit test react' }
  })
  fireEvent.change(authorInput, {
    target: { value: 'Dan Abramov' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'http://someurl.com' }
  })

  fireEvent.submit(form)

  var expectedResult = {
    title: 'How to unit test react',
    author: 'Dan Abramov',
    url: 'http://someurl.com'
  }

  expect(createBlogHandler.mock.calls).toHaveLength(1)
  expect(createBlogHandler.mock.calls[0][0]).toEqual(expectedResult)
})