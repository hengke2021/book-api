# Book Library API

This is a Node.js API for managing a book library. It includes features such as fetching all books, adding new books, marking books as borrowed, and deleting books.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hengke2021/book-api.git
Navigate to the project directory:

bash
Copy code
cd book-library-api
Install dependencies:

bash
Copy code
npm install
Usage
Start the server:

bash
Copy code
npm start
The server will run on http://localhost:3001.

Access the Swagger documentation:

Open your browser and go to http://localhost:3001/api-docs to view the Swagger documentation for the API.

API Endpoints
GET /books: Get all books.
POST /books: Add a new book.
PATCH /books/:id: Mark a book as borrowed.
DELETE /books/:id: Delete a book.
Testing
To run the unit tests, use the following command:

bash
Copy code
npm test
Contributing
If you'd like to contribute to this project, please follow the Contributing Guidelines.

License
This project is licensed under the MIT License.

css
Copy code

Feel free to customize the content based on your specific project details. You might want to create a `CONTRIBUTING.md` file if you have specific guidelines for contributors. Also, update the license information accordingly in the `LICENSE` file.