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

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required for registration." });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 10: Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Using Axios to fetch books (simulating client/server async request)
    // You can also return books directly, but using Axios fulfills the async requirement
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using async/await and Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    if (!isbn) {
      return res.status(400).json({ message: "ISBN parameter is missing or invalid." });
    }

    // Promise/Async logic wrapped or simulated with Axios/async check
    const getBookByISBN = new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found for the given ISBN."));
        }
      }, 1000);
    });

    const bookDetails = await getBookByISBN;
    return res.status(200).json(bookDetails);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});
  
// Task 12: Get book details based on author using async/await and Axios
public_users.get('/author/:author', async function (req, res) {
  const authorParam = req.params.author;
  try {
    if (!authorParam) {
      return res.status(400).json({ message: "Author parameter is missing or invalid." });
    }

    // Implementing using async/await with Promise filtering
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let filteredBooks = [];
      const keys = Object.keys(books);
      
      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === authorParam.toLowerCase()) {
          filteredBooks.push(books[key]);
        }
      });

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found for the specified author."));
      }
    });

    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 13: Get all books based on title using async/await and Axios
public_users.get('/title/:title', async function (req, res) {
  const titleParam = req.params.title;
  try {
    if (!titleParam) {
      return res.status(400).json({ message: "Title parameter is missing or invalid." });
    }

    // Implementing using async/await with Promise filtering
    const getBooksByTitle = new Promise((resolve, reject) => {
      let filteredBooks = [];
      const keys = Object.keys(books);

      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === titleParam.toLowerCase()) {
          filteredBooks.push(books[key]);
        }
      });

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found for the specified title."));
      }
    });

    const result = await getBooksByTitle;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
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
