import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let mockLikeBlog

  beforeEach(() => {
    var blog = {
      likes: 16,
      title: 'Things I don\'t know',
      author: 'Dan Abramov',
      url: 'http://danthings.com',
      user: {
        username: 'hellas',
        name: 'Arto Hellas',
        id: '5f78cac7112e48517c5efe48'
      },
      id: '5f791f967f63891f00fac5e7'
    }

    var user = {
      username: 'hellas'
    }

    mockLikeBlog = jest.fn()
    var mockRemoveBlog = jest.fn()
    component = render(
      <Blog blog={ blog } user={ user } handleLikeBlog={ mockLikeBlog } handleRemoveBlog={ mockRemoveBlog } />
    )
  })

  test('renders its title and author', () => {
    const blogInfoDiv = component.container.querySelector('.blog-info')
    expect(blogInfoDiv).toHaveTextContent('Things I don\'t know Dan Abramov')
  })

  test('does not render url and likes by default', () => {
    const blogExtraInfoDiv = component.container.querySelector('.blog-extra-info')
    expect(blogExtraInfoDiv).toHaveStyle('display: none')
  })

  test('does render url and likes after clicking show button', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.blog-extra-info')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('http://danthings.com')
    expect(div).toHaveTextContent('likes 16')
  })

  test('liking a button twice call the event handler two times', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockLikeBlog.mock.calls).toHaveLength(2)
  })
})