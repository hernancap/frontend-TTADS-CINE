describe('Inicio de sesión', () => {
    it('debería iniciar sesión correctamente con un usuario válido', () => {
      cy.visit('http://localhost:5173/login') 
  
      cy.get('input[type="email"]').type('asd2@test.com')
      cy.get('input[type="password"]').type('88888888')
      cy.get('button[type="submit"]').click()
  
      cy.url().should('not.include', '/login') 
      cy.contains('Bienvenido').should('exist') 
    })
  })
  