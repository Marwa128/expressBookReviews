const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to check if the username already exists
const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

// Register a new user route
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

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async (req, res) => {
  try {
    const getBooks = async () => {
      return books;
    };
    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using async/await with informative error handling
public_users.get('/isbn/:isbn', async (req, res) => {
  const targetISBN = req.params.isbn;
  try {
    const getBookByISBN = async () => {
      const book = books[targetISBN];
      if (!book) {
        throw new Error(`Book not found for ISBN: ${targetISBN}`);
      }
      return book;
    };
    const bookDetails = await getBookByISBN();
    return res.status(200).json(bookDetails);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details based on author using async/await with query in error message
public_users.get('/author/:author', async (req, res) => {
  const authorParam = req.params.author.toLowerCase();
  try {
    const getBooksByAuthor = async () => {
      const matchingBooks = Object.values(books).filter(
        (book) => book.author && book.author.toLowerCase() === authorParam
      );
      if (matchingBooks.length === 0) {
        throw new Error(`No books found for author: ${req.params.author}`);
      }
      return matchingBooks;
    };
    const result = await getBooksByAuthor();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 13: Get all books based on title using async/await with query in error message
public_users.get('/title/:title', async (req, res) => {
  const titleParam = req.params.title.toLowerCase();
  try {
    const getBookByTitle = async () => {
      const matchingTitle = Object.values(books).find(
        (book) => book.title && book.title.toLowerCase() === titleParam
      );
      if (!matchingTitle) {
        throw new Error(`No book found for title: ${req.params.title}`);
      }
      return matchingTitle;
    };
    const result = await getBookByTitle();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const targetISBN = req.params.isbn;
  if (books[targetISBN]) {
    return res.status(200).json(books[targetISBN].reviews);
  } else {
    return res.status(404).json({ message: `ISBN not found: ${targetISBN}` });
  }
});

module.exports.general = public_users;
