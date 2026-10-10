const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to check if user exists
const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  } else if (doesExist(username) || isValid(username)) {
    return res.status(409).json({ message: "User already exists." });
  } else {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
  }
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const targetISBN = req.params.isbn;
  if (books[targetISBN]) {
    return res.status(200).json(books[targetISBN]);
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorParam = req.params.author;
  let booksByAuthor = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].author === authorParam) {
      booksByAuthor.push(books[key]);
    }
  });
  if (booksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleParam = req.params.title;
  let booksByTitle = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].title === titleParam) {
      booksByTitle.push(books[key]);
    }
  });
  if (booksByTitle.length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const targetISBN = req.params.isbn;
  if (books[targetISBN]) {
    return res.status(200).send(JSON.stringify(books[targetISBN].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ==========================================
// Tasks 10-13: Async/Await & Axios Implementations
// ==========================================

// Internal source route for Axios requests
public_users.get("/server/books", function (req, res) {
  res.json(books);
});

// Task 10: Get all books using async/await and Axios
public_users.get('/server/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/server/books");
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using async/await and Axios
public_users.get('/server/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get("http://localhost:5000/server/books");
    const book = response.data[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book" });
  }
});

// Task 12: Get book details based on author using async/await and Axios
public_users.get('/server/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/server/books");
    const result = Object.keys(response.data)
      .filter((key) => response.data[key].author === author)
      .map((key) => response.data[key]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 13: Get all books based on title using async/await and Axios
public_users.get('/server/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get("http://localhost:5000/server/books");
    const result = Object.keys(response.data)
      .filter((key) => response.data[key].title === title)
      .map((key) => response.data[key]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Title not found" });
    }
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

module.exports.general = public_users;
