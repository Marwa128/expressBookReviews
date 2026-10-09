const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to check if the username already exists in the system
const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

// Route to handle user registration
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  } else if (doesExist(username)) {
    return res.status(409).json({ message: "User already exists." });
  } else {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Please login." });
  }
});

// Task 10: Get the list of all books available in the shop using async/await
public_users.get('/', async (req, res) => {
  try {
    // Asynchronously fetch all books using Promise resolution
    const allBooks = await Promise.resolve(books);
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  const targetISBN = req.params.isbn;
  try {
    // Asynchronously fetch book details by ISBN
    const book = await Promise.resolve(books[targetISBN]);
    if (!book) {
      return res.status(404).json({ message: "ISBN not found." });
    }
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 12: Get book details based on author using async/await (optimized and direct)
public_users.get('/author/:author', async (req, res) => {
  const authorParam = req.params.author.toLowerCase();
  try {
    // Directly filter books by author asynchronously without redundant inner functions
    const matchingBooks = await Promise.resolve(
      Object.values(books).filter(
        (book) => book.author && book.author.toLowerCase() === authorParam
      )
    );

    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: "No books by that author." });
    }
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 13: Get all books based on title using async/await (optimized and direct)
public_users.get('/title/:title', async (req, res) => {
  const titleParam = req.params.title.toLowerCase();
  try {
    // Directly find book by title asynchronously without redundant inner functions
    const matchingTitle = await Promise.resolve(
      Object.values(books).find(
        (book) => book.title && book.title.toLowerCase() === titleParam
      )
    );

    if (!matchingTitle) {
      return res.status(404).json({ message: "Title not found." });
    }
    return res.status(200).json(matchingTitle);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route to get book reviews based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const targetISBN = req.params.isbn;
  if (books[targetISBN]) {
    return res.status(200).send(JSON.stringify(books[targetISBN].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

module.exports.general = public_users;
