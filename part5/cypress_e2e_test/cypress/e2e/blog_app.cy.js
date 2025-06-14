describe('Blogger app', function() {

  //Se ejecuta antes de cada prueba
  beforeEach(function() {
    //Creamos un usuario para las pruebas
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      username: "prueba",
      name: "My Test User",
      password: "test1"
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('5.17 - Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('Log-in').click()
    cy.get('#login-button').should('be.visible')
  })

   describe('5.18 - Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('Log-in').click()
      cy.get('#username').type('prueba')
      cy.get('#password').type('test1')
      cy.get('#login-button').click()

      cy.contains('My Test User logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('Log-in').click()
      cy.get('#username').type('asd')
      cy.get('#password').type('asd')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Err: invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'My Test User logged-in')
    })
  })

  describe('5.19 - When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'prueba', password: 'test1' })
    })

    it('a new blog can be created', function() {
      cy.contains('Create Blog').click()
      cy.get('#inputTitle').type('Blog to E2E test')
      cy.get('#inputAuthor').type('Black')
      cy.get('#inputUrl').type('www.mye2etest.com')
      cy.contains('save').click()
      cy.contains('A new blog Blog to E2E test added')
      cy.contains('Blog to E2E test of Black').should('exist')

    })
  })

  describe('5.20 - When logged in and a one blog create', function() {
    beforeEach(function() {
      cy.login({ username: 'prueba', password: 'test1' })

      cy.createBlog({title: 'Blog to E2E test', author: 'Black',url: 'www.mye2etest.com'})
      cy.createBlog({title: 'Mi second blog e2e', author: 'Blackamp',url: 'www.wrong.com'})
    })

    it('like a blog', function() {
      cy.get('.blog-summary')
        .contains("Blog to E2E test of Black")
        .contains("View").click()
      
      cy.get('.blog-details')
        .contains("Blog to E2E test of Black")
        .should('be.visible')
        .as('myBlogDetails') 
      
      cy.get('@myBlogDetails').parent()
        .contains('Likes ♡ - 0').should('be.visible')

      cy.get('@myBlogDetails').parent()
        .contains('Likes ♡ - 0')
        .contains("like").click()

      cy.get('@myBlogDetails').parent()
        .contains('Likes ♡ - 1').should('be.visible')

    })
  })

  describe('5.21 - user delete own blog created', function() {
    beforeEach(function() {
      cy.login({ username: 'prueba', password: 'test1' })

      cy.createBlog({title: 'Blog to E2E test', author: 'Black',url: 'www.mye2etest.com'})
      cy.createBlog({title: 'Mi second blog e2e', author: 'Blackamp',url: 'www.wrong.com'})
    })

    it('delete a blog', function() {
      
      cy.get('.blog-summary')
        .contains("Blog to E2E test of Black")
        .contains("View").click()
      
      cy.get('.blog-details')
        .contains("Blog to E2E test of Black")
        .should('be.visible')
        .as('myBlogDetails') 
      
      cy.get('@myBlogDetails').parent()
        .contains('Remove blog').click()

      cy.get('@myBlogDetails').should('not.exist')
    })
  })

  describe('5.22 - user cant delete blog', function() {
    beforeEach(function() {
      const user = {username: "prueba2", name: "Second", password: "test2"}
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

      cy.login({ username: 'prueba', password: 'test1' })
      cy.createBlog({title: 'Blog to E2E test', author: 'Black',url: 'www.mye2etest.com'})
    })

    it('cant delete a blog', function() {
      
      cy.get('.blog-summary')
        .contains("Blog to E2E test of Black")
        .contains("View").click()
      
      cy.get('.blog-details')
        .contains("Blog to E2E test of Black")
        .should('be.visible')
        .as('myBlogDetails') 
      
      cy.get('@myBlogDetails').parent()
        .contains('Remove blog')

      cy.contains("logout").click()
      cy.login({ username: 'prueba2', password: 'test2' })

      cy.get('.blog-summary')
        .contains("Blog to E2E test of Black")
        .contains("View").click()

      cy.get('.blog-summary')
        .contains("Blog to E2E test of Black")
        .parent()
        .contains('Remove blog').should('not.exist')
    })
  })

  describe('5.23 - Blogs are ordered by likes', function() {
    beforeEach(function() {
      cy.login({ username: 'prueba', password: 'test1' })

      cy.createBlog({ title: 'Least liked', author: 'A', url: 'www.a.com' })
      cy.createBlog({ title: 'Medium liked', author: 'B', url: 'www.b.com' })
      cy.createBlog({ title: 'Most liked', author: 'C', url: 'www.c.com' })
    })

    it('blogs are ordered by descending likes', function() {

      //Despliego todos los blogs
      cy.get('.blog-summary').contains("Least liked").contains("View").click()
      cy.get('.blog-summary').contains("Medium liked").contains("View").click()
      cy.get('.blog-summary').contains("Most liked").contains("View").click()

      //Incremento el número de likes de cada blog esperando entre cada click
      cy.get('.blog-details').contains("Least liked of A").parent()
        .contains('Likes ♡ - 0').contains("like").click()
      cy.wait(500)
      cy.get('.blog-details').contains("Medium liked").parent()
        .contains('Likes ♡ - 0').contains("like").click()
      cy.wait(500)
      cy.get('.blog-details').contains("Most liked").parent()
        .contains('Likes ♡ - 0').contains("like").click()

      cy.wait(500)

      cy.get('.blog-details').contains("Medium liked").parent()
        .contains('Likes ♡ - 1').contains("like").click()
      cy.wait(500)
      cy.get('.blog-details').contains("Most liked").parent()
        .contains('Likes ♡ - 1').contains("like").click()
      
      cy.wait(500)
      
      cy.get('.blog-details').contains("Most liked").parent()
        .contains('Likes ♡ - 2').contains("like").click()
      
      cy.wait(1000)
      
      //Compruebo orden
      cy.get('.blog-details').eq(0).should('contain', 'Most liked')
      cy.get('.blog-details').eq(1).should('contain', 'Medium liked')
      cy.get('.blog-details').eq(2).should('contain', 'Least liked')

    })
  })
})