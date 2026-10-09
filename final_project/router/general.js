const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to check if username exists
const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

// Register a new user
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

// Task 10: Get the book list available in the shop using async/await with error handling
public_users.get("/", async (req, res) => {
  try {
    if (!books) {
      return res.status(404).json({ message: "Books database not found." });
    }
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using async/await with error handling
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const targetISBN = req.params.isbn;
    if (!books || !books[targetISBN]) {
      return res.status(404).json({ message: "ISBN not found." });
    }
    return res.status(200).json(books[targetISBN]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Task 12: Get book details based on author using async/await with robust error handling & checks
public_users.get("/author/:author", async (req, res) => {
  try {
    if (!books) {
      return res.status(404).json({ message: "Books database not found." });
    }

    const authorParam = req.params.author.toLowerCase();
    const matchingBooks = Object.values(books).filter(
      (book) => book.author && book.author.toLowerCase() === authorParam
    );

    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found by that author." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Task 13: Get all books based on title using async/await with robust error handling & checks
public_users.get("/title/:title", async (req, res) => {
  try {
    if (!books) {
      return res.status(404).json({ message: "Books database not found." });
    }

    const titleParam = req.params.title.toLowerCase();
    const matchingTitle = Object.values(books).find(
      (book) => book.title && book.title.toLowerCase() === titleParam
    );

    if (matchingTitle) {
      return res.status(200).json(matchingTitle);
    } else {
      return res.status(404).json({ message: "Title not found." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  try {
    const targetISBN = req.params.isbn;
    if (!books || !books[targetISBN]) {
      return res.status(404).json({ message: "ISBN not found." });
    }
    return res.status(200).send(JSON.stringify(books[targetISBN].reviews, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports.general = public_users;
