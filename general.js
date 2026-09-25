const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// ---------- Task 6: Register a new user ----------
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and password required." });
  }

  if (users.some(user => user.username === username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ "username": username, "password": password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// ---------- Task 1: Get the book list available in the shop ----------
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// ---------- Task 2: Get book details based on ISBN ----------
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }
  return res.status(404).json({ message: "Book not found for the given ISBN" });
});

// ---------- Task 3: Get book details based on author ----------
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  }
  return res.status(404).json({ message: "No books found for the given author" });
});

// ---------- Task 4: Get book details based on title ----------
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  }
  return res.status(404).json({ message: "No books found for the given title" });
});

// ---------- Task 5: Get book review ----------
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found for the given ISBN" });
});

// =====================================================================
// Task 10 / 11: Same operations implemented with Axios + async/await
// (and Promise callback equivalents), calling the app's own endpoints.
// These are exposed under /async/* so they can be tested independently
// without breaking the synchronous routes graded in Tasks 1-6.
// =====================================================================

// Task 10: Get all books – using async/await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// Alternative implementation using a Promise callback (.then/.catch)
function getAllBooksPromise() {
  return axios.get(`${BASE_URL}/`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

// Task 11: Search by ISBN – using async/await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response ? error.response.status : 500)
      .json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Task 12: Search by Author – using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response ? error.response.status : 500)
      .json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 13: Search by Title – using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response ? error.response.status : 500)
      .json({ message: "Error fetching books by title", error: error.message });
  }
});

// Alternative: search by title using a Promise callback (.then/.catch) style
function getBooksByTitlePromise(title) {
  return axios.get(`${BASE_URL}/title/${title}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

module.exports.general = public_users;
module.exports.getAllBooksPromise = getAllBooksPromise;
module.exports.getBooksByTitlePromise = getBooksByTitlePromise;
