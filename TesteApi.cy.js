/// <reference types="cypress" />


describe('API Automation Tests', () => {
  let bookId;
  let orderId;
  const token = '589a9e079b174f33a4969b7b1289d307d62b0412ae5afeaa15ed62ed5692d280';


it('API Status - GET', () => {
  cy.request('GET', 'https://simple-books-api.glitch.me/status')
    .then((response) => {
      cy.log('Response Body:', response.body); // Exibir o corpo da resposta
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('OK');
    });
});

it('List of books - GET with type non-fiction', () => {
  cy.request('GET', 'https://simple-books-api.glitch.me/books?type=non-fiction')
    .then((response) => {
      cy.log('Response Body:', response.body); // Exibir o corpo da resposta
      expect(response.status).to.equal(200);
      const nonFictionBooks = response.body.filter((book) => book.available === true);
      const book = nonFictionBooks[0];
      expect(book).to.be.an('object');
      expect(book.available).to.be.true;
      expect(book.type).to.equal('non-fiction');
      bookId = book.id;
    });
});

it('Get single book - GET with bookId', () => {
  cy.request('GET', `https://simple-books-api.glitch.me/books/${bookId}`)
    .then((response) => {
      cy.log('Response Body:', response.body); // Exibir o corpo da resposta
      expect(response.status).to.equal(200);
      expect(response.body['current-stock']).to.be.above(0);
    });
});

it('Order book - POST', () => {
  cy.request({
    method: 'POST',
    url: 'https://simple-books-api.glitch.me/orders',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: {
      bookId: bookId
    }
  }).then((response) => {
    cy.log('Response Body:', response.body); // Exibir o corpo da resposta
    expect(response.status).to.equal(201);
    orderId = response.body.orderId;
  });
});

it('Order all book orders - GET', () => {
  cy.request({
    method: 'GET',
    url: 'https://simple-books-api.glitch.me/orders',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    cy.log('Response Body:', response.body); // Exibir o corpo da resposta
    expect(response.status).to.equal(200);
  });
});

it('Get an order - GET with orderId', () => {
  cy.request({
    method: 'GET',
    url: `https://simple-books-api.glitch.me/orders/${orderId}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    cy.log('Response Body:', response.body); // Exibir o corpo da resposta
    expect(response.status).to.equal(200);
  });
});

it('Update an order - PATCH with orderId', () => {
  cy.request({
    method: 'PATCH',
    url: `https://simple-books-api.glitch.me/orders/${orderId}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    cy.log('Response Body:', response.body); // Exibir o corpo da resposta
    expect(response.status).to.equal(204);
  });
});

it('Delete order - DELETE with orderId', () => {
  cy.request({
    method: 'DELETE',
    url: `https://simple-books-api.glitch.me/orders/${orderId}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    cy.log('Response Body:', response.body); // Exibir o corpo da resposta
    expect(response.status).to.equal(204);
  });
});


const faker = require('faker');

describe('Register API Client - POST', () => {
  it('Deve registrar um novo cliente na API', () => {
    // Gerando um nome e e-mail aleatórios com o faker
    const randomName = faker.name.firstName();
    const randomEmail = faker.internet.email();

    // Fazendo a solicitação POST para registrar um novo cliente
    cy.request({
      method: 'POST',
      url: 'https://simple-books-api.glitch.me/api-clients/',
      headers: {
        Authorization: 'Bearer 589a9e079b174f33a4969b7b1289d307d62b0412ae5afeaa15ed62ed5692d280'
      },
      body: {
        clientName: randomName,
        clientEmail: randomEmail
      }
    }).then((response) => {
      // Verificando se a resposta foi bem-sucedida (status 201)
      expect(response.status).to.equal(201);

      // Exibindo os dados retornados no console do Cypress
      cy.log('Dados do novo cliente:', response.body);
    });
  });
});
});