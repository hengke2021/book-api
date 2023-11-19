const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const oauth2orize = require('oauth2orize');
const passport = require('passport');
const Nedb = require('nedb');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3001;

// In-memory database using nedb
const db = new Nedb({ autoload: true });

// Express middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// OAuth2 Configuration
let server = oauth2orize.createServer();
server.serializeClient((client, done) => done(null, client.id));
server.deserializeClient((id, done) => done(null, { id, name: 'Book Library App' }));

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Book Library API',
    version: '1.0.0',
    description: 'API for managing a book library',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       '200':
 *         description: Successful response
 */
app.get('/books', async (req, res) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Book created successfully
 *       '400':
 *         description: Bad request
 */
app.post('/books', async (req, res) => {
  try {
    const { name, author } = req.body;
    const book = { name, author, status: 'Available' };
    const newBook = await addBook(book);
    res.
    status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       '200':
 *         description: Successful response
 */

// Existing POST route
// ...

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Mark a book as borrowed
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to be marked as borrowed
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrowed:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Book updated successfully
 *       '404':
 *         description: Book not found
 *       '400':
 *         description: Bad request
 */
app.patch('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await markAsBorrowed(id);
    res.status(200).json(updatedBook);
  } catch (error) {
    if (error === 'Not Found') {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(400).json({ error: 'Bad Request' });
    }
  }
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to be deleted
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Book deleted successfully
 *       '404':
 *         description: Book not found
 */
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteBook(id);
    res.status(204).send();
  } catch (error) {
    if (error === 'Not Found') {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Helper functions

// Existing helper functions
// ...

async function markAsBorrowed(id) {
  return new Promise((resolve, reject) => {
    db.findOne({ _id: id }, (err, book) => {
      if (err) {
        reject(err);
      } else if (!book) {
        reject('Not Found');
      } else {
        book.status = 'borrowed';
        db.update({ _id: id }, book, {}, (updateErr) => {
          if (updateErr) {
            reject(updateErr);
          } else {
            resolve(book);
          }
        });
      }
    });
  });
}

async function deleteBook(id) {
  return new Promise((resolve, reject) => {
    db.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        reject(err);
      } else if (numRemoved === 0) {
        reject('Not Found');
      } else {
        resolve();
      }
    });
  });
}

// Start the server
server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = server;
// Helper functions

async function getAllBooks() {
  return new Promise((resolve, reject) => {
    db.find({}, (err, books) => {
      if (err) {
        reject(err);
      } else {
        resolve(books);
      }
    });
  });
}

async function addBook(book) {
  return new Promise((resolve, reject) => {
    db.insert(book, (err, newBook) => {
      if (err) {
        reject(err);
      } else {
        resolve(newBook);
      }
    });
  });
}
