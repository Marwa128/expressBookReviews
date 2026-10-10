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

// Helper function to filter books by author
const fetchBooksByAuthor = (authorName) => {
  return new Promise((resolve, reject) => {
    let booksByAuthor = [];
    let keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].author === authorName) {
        booksByAuthor.push(books[key]);
      }
    });
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject(new Error("Author not found"));
    }
  });
};

// Helper function to filter books by title
const fetchBooksByTitle = (titleName) => {
  return new Promise((resolve, reject) => {
    let booksByTitle = [];
    let keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].title === titleName) {
        booksByTitle.push(books[key]);
      }
    });
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject(new Error("Title not found"));
    }
  });
};

// Helper function to get book by ISBN
const fetchBookByISBN = (isbnNum) => {
  return new Promise((resolve, reject) => {
    if (books[isbnNum]) {
      resolve(books[isbnNum]);
    } else {
      reject(new Error("ISBN not found"));
    }
  });
};

// Route: Register a new user
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

// Route: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 10: Get the list of all books available in the shop using async/await
public_users.get('/server/books', async (req, res) => {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const allBooks = await getBooks;
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const targetISBN = req.params.isbn;
  if (!targetISBN) {
    return res.status(400).json({ message: "Invalid ISBN parameter." });
  }
  if (books[targetISBN]) {
    return res.status(200).json(books[targetISBN]);
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/server/isbn/:isbn', async (req, res) => {
  const targetISBN = req.params.isbn;
  
  // Validate input parameter format/presence
  if (!targetISBN || targetISBN.trim() === "") {
    return res.status(400).json({ message: "Invalid or missing ISBN parameter." });
  }

  try {
    // Using modular helper function with async/await
    const book = await fetchBookByISBN(targetISBN);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Route: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorParam = req.params.author;
  if (!authorParam) {
    return res.status(400).json({ message: "Invalid author parameter." });
  }
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

// Task 12: Get book details based on author using async/await
public_users.get('/server/author/:author', async (req, res) => {
  const authorParam = req.params.author;

  // Validate input parameter
  if (!authorParam || authorParam.trim() === "") {
    return res.status(400).json({ message: "Invalid or missing author parameter." });
  }

  try {
    // Using modular helper function with async/await
    const result = await fetchBooksByAuthor(authorParam);
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Route: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleParam = req.params.title;
  if (!titleParam) {
    return res.status(400).json({ message: "Invalid title parameter." });
  }
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

// Task 13: Get all books based on title using async/await
public_users.get('/server/title/:title', async (req, res) => {
  const titleParam = req.params.title;

  // Validate input parameter
  if (!titleParam || titleParam.trim() === "") {
    return res.status(400).json({ message: "Invalid or missing title parameter." });
  }

  try {
    // Using modular helper function with async/await
    const result = await fetchBooksByTitle(titleParam);
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Route: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const targetISBN = req.params.isbn;
  if (books[targetISBN]) {
    return res.status(200).send(JSON.stringify(books[targetISBN].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
