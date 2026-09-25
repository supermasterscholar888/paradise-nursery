const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// ============================================================================
// PUBLIC ROUTES - BOOK RETRIEVAL & USER REGISTRATION
// ============================================================================

/**
 * POST /register
 * Register a new user account
 * 
 * Body Parameters:
 *   - username (string, required): Unique username for the account
 *   - password (string, required): Password for the account
 * 
 * Returns:
 *   - Success (200): { message: "User successfully registered. Now you can login" }
 *   - Error (404): { message: "User already exists!" } or missing field message
 * 
 * @route POST /register
 * @param {Object} req.body - Request body with username and password
 * @param {string} req.body.username - New username to register
 * @param {string} req.body.password - Password for new account
 * @returns {Object} Success or error message
 */
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validate that both username and password are provided
  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and password required." });
  }

  // Check if username already exists in the users array
  if (users.some(user => user.username === username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  // Add new user to users array
  users.push({ "username": username, "password": password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// ============================================================================
// SYNCHRONOUS BOOK RETRIEVAL ENDPOINTS
// ============================================================================

/**
 * GET /
 * Retrieve all available books from the database
 * 
 * Returns: JSON object with all books, keyed by ISBN (1-10)
 * Each book contains: author, title, reviews (object)
 * 
 * Example Response:
 * {
 *   "1": { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {} },
 *   "2": { "author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": {} },
 *   ...
 * }
 * 
 * @route GET /
 * @returns {Object} All books in the database
 */
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

/**
 * GET /isbn/:isbn
 * Retrieve a specific book by ISBN number
 * 
 * URL Parameters:
 *   - isbn (number): ISBN identifier (1-10)
 * 
 * Returns:
 *   - Success (200): Book object { author, title, reviews }
 *   - Error (404): { message: "Book not found for the given ISBN" }
 * 
 * Example:
 *   GET /isbn/1
 *   Returns: { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {} }
 * 
 * @route GET /isbn/:isbn
 * @param {string} req.params.isbn - ISBN number to search for
 * @returns {Object} Book object if found, or error message
 */
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }
  return res.status(404).json({ message: "Book not found for the given ISBN" });
});

/**
 * GET /author/:author
 * Retrieve all books by a specific author (case-insensitive)
 * 
 * URL Parameters:
 *   - author (string): Author name to search for
 * 
 * Returns:
 *   - Success (200): Object with matching books { isbn: book_object, ... }
 *   - Error (404): { message: "No books found for the given author" }
 * 
 * Example:
 *   GET /author/Homer
 *   Returns: {
 *     "6": { "author": "Homer", "title": "The Iliad", "reviews": {} },
 *     "7": { "author": "Homer", "title": "The Odyssey", "reviews": {} }
 *   }
 * 
 * Note: Search is case-insensitive
 * 
 * @route GET /author/:author
 * @param {string} req.params.author - Author name to search for
 * @returns {Object} Books by that author, or error message
 */
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = {};

  // Iterate through all books and filter by author (case-insensitive)
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  // Return matching books if any found, otherwise return 404
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  }
  return res.status(404).json({ message: "No books found for the given author" });
});

/**
 * GET /title/:title
 * Retrieve all books with a specific title (case-insensitive)
 * 
 * URL Parameters:
 *   - title (string): Book title to search for
 * 
 * Returns:
 *   - Success (200): Object with matching books { isbn: book_object, ... }
 *   - Error (404): { message: "No books found for the given title" }
 * 
 * Example:
 *   GET /title/Pride%20and%20Prejudice
 *   Returns: {
 *     "8": { "author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {} }
 *   }
 * 
 * Note: URL encode spaces as %20 or use + for space
 * 
 * @route GET /title/:title
 * @param {string} req.params.title - Book title to search for
 * @returns {Object} Books with that title, or error message
 */
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = {};

  // Iterate through all books and filter by title (case-insensitive)
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  // Return matching books if any found, otherwise return 404
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  }
  return res.status(404).json({ message: "No books found for the given title" });
});

/**
 * GET /review/:isbn
 * Retrieve all reviews for a specific book
 * 
 * URL Parameters:
 *   - isbn (number): ISBN identifier (1-10)
 * 
 * Returns:
 *   - Success (200): Reviews object { username: review_text, ... }
 *                    Empty object {} if no reviews yet
 *   - Error (404): { message: "Book not found for the given ISBN" }
 * 
 * Example:
 *   GET /review/1
 *   Initial: {}
 *   After reviews: { "alice": "Great book!", "bob": "Highly recommend" }
 * 
 * @route GET /review/:isbn
 * @param {string} req.params.isbn - ISBN number to get reviews for
 * @returns {Object} Reviews for the book, or error message
 */
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found for the given ISBN" });
});

// ============================================================================
// ASYNCHRONOUS ROUTES WITH AXIOS & ASYNC/AWAIT
// ============================================================================
// These routes demonstrate retrieving book data asynchronously by making
// HTTP requests to the synchronous endpoints using Axios library.
// This pattern is useful for learning async/await and HTTP client usage.
// ============================================================================

/**
 * GET /async/books
 * Asynchronously retrieve all books using Axios
 * 
 * Implementation Pattern: async/await with Axios
 * 
 * This route demonstrates:
 *   - async function syntax
 *   - Axios GET request
 *   - Error handling with try/catch
 *   - HTTP response forwarding
 * 
 * Returns: Same as GET / endpoint (all books)
 * 
 * @route GET /async/books
 * @async
 * @returns {Object} All books, or error message
 */
public_users.get('/async/books', async function (req, res) {
  try {
    // Make asynchronous HTTP request to the synchronous endpoint
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

/**
 * Alternative Implementation: Using Promise callbacks (.then/.catch)
 * 
 * This function demonstrates the traditional Promise pattern before async/await
 * Returns a Promise that resolves with all books
 * 
 * Usage:
 *   getAllBooksPromise()
 *     .then(books => console.log(books))
 *     .catch(error => console.error(error))
 * 
 * @function getAllBooksPromise
 * @returns {Promise} Resolves with all books or rejects with error
 */
function getAllBooksPromise() {
  return axios.get(`${BASE_URL}/`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

/**
 * GET /async/isbn/:isbn
 * Asynchronously retrieve book by ISBN using Axios
 * 
 * Implementation Pattern: async/await with Axios
 * 
 * URL Parameters:
 *   - isbn (number): ISBN identifier (1-10)
 * 
 * This route demonstrates:
 *   - URL parameter passing to async function
 *   - Dynamic endpoint construction
 *   - Proper error status handling
 * 
 * Returns:
 *   - Success (200): Book object
 *   - Error: Appropriate HTTP status with error message
 * 
 * @route GET /async/isbn/:isbn
 * @async
 * @param {string} req.params.isbn - ISBN to search for
 * @returns {Object} Book object or error message
 */
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    // Make asynchronous HTTP request with ISBN parameter
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Preserve the original HTTP status code if available
    return res.status(error.response ? error.response.status : 500)
      .json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

/**
 * GET /async/author/:author
 * Asynchronously retrieve books by author using Axios
 * 
 * Implementation Pattern: async/await with Axios
 * 
 * URL Parameters:
 *   - author (string): Author name to search for
 * 
 * This route demonstrates:
 *   - Parameter extraction and passing
 *   - Asynchronous filtering across multiple results
 *   - Error handling with appropriate status codes
 * 
 * Returns:
 *   - Success (200): Object with all matching books
 *   - Error: Appropriate HTTP status with error message
 * 
 * Example:
 *   GET /async/author/Homer
 *   Returns books by Homer with status 200
 * 
 * @route GET /async/author/:author
 * @async
 * @param {string} req.params.author - Author name to search for
 * @returns {Object} Books by author or error message
 */
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    // Make asynchronous HTTP request to fetch books by author
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Handle errors while preserving original status codes
    return res.status(error.response ? error.response.status : 500)
      .json({ message: "Error fetching books by author", error: error.message });
  }
});

/**
 * GET /async/title/:title
 * Asynchronously retrieve books by title using Axios
 * 
 * Implementation Pattern: async/await with Axios
 * 
 * URL Parameters:
 *   - title (string): Book title to search for
 * 
 * This route demonstrates:
 *   - URL encoding handling (spaces as %20)
 *   - Title-based searching
 *   - Consistent error handling patterns
 * 
 * Returns:
 *   - Success (200): Object with matching books
 *   - Error: Appropriate HTTP status with error message
 * 
 * Note: URL encode spaces as %20 in the request
 * 
 * @route GET /async/title/:title
 * @async
 * @param {string} req.params.title - Book title to search for
 * @returns {Object} Books with that title or error message
 */
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    // Make asynchronous HTTP request to fetch books by title
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Handle errors with appropriate HTTP status codes
    return res.status(error.response ? error.response.status : 500)
      .json({ message: "Error fetching books by title", error: error.message });
  }
});

/**
 * Alternative Implementation: Using Promise callbacks (.then/.catch)
 * 
 * This function demonstrates searching books by title using Promises
 * Returns a Promise that resolves with matching books
 * 
 * Implementation Pattern: Traditional Promise callbacks
 * 
 * Usage:
 *   getBooksByTitlePromise("Pride and Prejudice")
 *     .then(books => console.log(books))
 *     .catch(error => console.error(error))
 * 
 * Demonstrates:
 *   - .then() for successful responses
 *   - .catch() for error handling
 *   - Promise chaining
 * 
 * @function getBooksByTitlePromise
 * @param {string} title - Book title to search for
 * @returns {Promise} Resolves with books by title or rejects with error
 */
function getBooksByTitlePromise(title) {
  return axios.get(`${BASE_URL}/title/${title}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

// ============================================================================
// EXPORT ROUTES AND HELPER FUNCTIONS
// ============================================================================

/**
 * Export the public router and promise-based helper functions
 * 
 * general: Express router with all public endpoints
 * getAllBooksPromise: Function to get all books using Promise callbacks
 * getBooksByTitlePromise: Function to get books by title using Promise callbacks
 */
module.exports.general = public_users;
module.exports.getAllBooksPromise = getAllBooksPromise;
module.exports.getBooksByTitlePromise = getBooksByTitlePromise;
