// test/test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assuming the app.js is in the root directory

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Tests', () => {
  // Test for the GET /books endpoint
  it('should get all books', (done) => {
    chai
      .request(app)
      .get('/books')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Test for the POST /books endpoint
  it('should add a new book', (done) => {
    const newBook = { name: 'Test Book', author: 'Test Author' };

    chai
      .request(app)
      .post('/books')
      .send(newBook)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', 'Test Book');
        expect(res.body).to.have.property('author', 'Test Author');
        done();
      });
  });

  // Test for the PATCH /books/:id endpoint
  it('should mark a book as borrowed', (done) => {
    // Assuming you have a book ID available for testing
    const id = 'FdqmfauIDtOe8m1X';

    chai
      .request(app)
      .patch(`/books/${id}`)
      .send({ borrowed: true })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', 'borrowed');
        done();
      });
  });

  // Test for the DELETE /books/:id endpoint
  it('should delete a book', (done) => {
    // Assuming you have a book ID available for testing
    const id = 'FdqmfauIDtOe8m1X';

    chai
      .request(app)
      .delete(`/books/${id}`)
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });

  after((done) => {
    // Close the server after all tests are done
    server.close(() => {
      done();
    });
  });
});

