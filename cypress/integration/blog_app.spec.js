const { _ } = Cypress

describe('Blog app', function() {
  beforeEach(function() {
    cy.resetDatabase()
    cy.createUser({ username: 'hellas', name: 'Arto Hellas', password: '123456' })
    cy.visit('http://localhost:3000')
  })

  it ('login form is visible by default', function() {
    cy.get('.login-form').should('be.visible')
  })

  describe('login', function() {
    it('suceeds with correct credentials', function() {
      cy.get('#username').type('hellas')
      cy.get('#password').type('123456')
      cy.get('#login-button').click()

      cy.contains('Arto Hellas logged in')
    })

    it ('fails with wrong credentials', function() {
      cy.get('#username').type('wrong')
      cy.get('#password').type('user')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'Wrong Credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'hellas', password: '123456' })
    })

    it('A blog can be created', function() {
      cy.get('#toggleShow').click()
      cy.get('#title').type('Cypress blog')
      cy.get('#author').type('Some Author')
      cy.get('#url').type('http://blog.test')
      cy.get('#create-blog-button').click()

      cy.get('.success').contains('Cypress blog by Some Author added')
      cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)')
      cy.get('.blog-info').contains('Cypress blog Some Author')
    })
  })

  describe('When a blog exists and user is logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'hellas', password: '123456' })
      cy.createBlog({ title: 'Random blog', author: 'Random Author', url:'http://blog.test', likes: 0 })
    })

    it('A blog can be liked', function() {
      cy.get('.blog-info').contains('view').click()
      cy.get('.blog-extra-info').get('.like-button').click()
      cy.get('.blog-extra-info').contains('likes 1')
    })

    it('A blog can be deleted by the user who posted it', function() {
      cy.get('.blog-info').contains('view').click()
      cy.get('.blog-extra-info').get('.delete-button').click()
      cy.on('window:confirm', () => true)
      cy.get('.blog-info').should('not.contain', 'Cypress blog Some Author')
    })

    it('A blog can not be deleted by a different user', function() {
      cy.createUser({ username: 'another', name: 'Another User', password: 'user' })
      cy.login({ username: 'another', password: 'user' })
      cy.get('.blog-info').contains('view').click()
      cy.get('.blog-extra-info').get('.delete-button').should('not.be.visible')
    })
  })

  describe('When many blogs exist', function() {
    beforeEach(function() {
      cy.login({ username: 'hellas', password: '123456' })
      cy.createBlog({ title: 'Average liked blog', author: 'Random Author', url:'http://blog.test', likes: 10 })
      cy.createBlog({ title: 'Most liked blog', author: 'Random Author', url:'http://blog.test', likes: 25 })
      cy.createBlog({ title: 'No one liked this blog', author: 'Random Author', url:'http://blog.test', likes: 0 })
    })

    it('Blogs are returned ordered by number of likes', function() {
      cy.get('.blog-extra-info').should('have.length', 3)

      cy.get('.likes')
        .then((rows) => _.map(rows, 'textContent'))
        .then((likesContents) => likesContents.map((likeContent) => parseInt(_.words(likeContent)[1])))
        .then((likes) => {
          const sorted = _.orderBy(likes, ['desc'])
          expect(likes, 'blogs are sorted by likes').to.deep.equal(sorted)
        })
    })
  })
})