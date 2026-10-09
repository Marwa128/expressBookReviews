const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required for registration." });
  }

  // Check if user already exists (using imported function or users array check)
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  // Add new user to users array
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    // Return all books formatted nicely
    return res.status(200).json(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Validate input parameter
    if (!isbn) {
      return res.status(400).json({ message: "ISBN parameter is missing or invalid." });
    }

    // Retrieve book by ISBN key
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found for the given ISBN." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
  
// Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  const authorParam = req.params.author;
  try {
    // Validate input parameter
    if (!authorParam) {
      return res.status(400).json({ message: "Author parameter is missing or invalid." });
    }

    let filteredBooks = [];
    const keys = Object.keys(books);
    
    // Iterate through books to match the author
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === authorParam.toLowerCase()) {
        filteredBooks.push(books[key]);
      }
    });

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found for the specified author." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  const titleParam = req.params.title;
  try {
    // Validate input parameter
    if (!titleParam) {
      return res.status(400).json({ message: "Title parameter is missing or invalid." });
    }

    let filteredBooks = [];
    const keys = Object.keys(books);

    // Iterate through books to match the title
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === titleParam.toLowerCase()) {
        filteredBooks.push(books[key]);
      }
    });

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found for the specified title." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  try {
    if (!isbn || !books[isbn]) {
      return res.status(404).json({ message: "Book not found or invalid ISBN." });
    }
    return res.status(200).json(books[isbn].reviews);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports.general = public_users;
