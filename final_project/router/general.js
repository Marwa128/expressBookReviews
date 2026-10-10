const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 10: Get all books using Promise / async-await
public_users.get('/books', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });
  getBooks.then((booksList) => {
    res.send(JSON.stringify(booksList, null, 4));
  }).catch((err) => {
    res.status(500).json({ message: "Error fetching books" });
  });
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 11: Get book details based on ISBN using Promise / async-await
public_users.get('/isbn/async/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBN.then((book) => {
    res.send(JSON.stringify(book, null, 4));
  }).catch((err) => {
    res.status(err.status || 500).json({ message: err.message });
  });
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });
  if (booksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Task 12: Get book details based on author using Promise / async-await
public_users.get('/author/async/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let booksByAuthor = [];
    let keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    });
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ status: 404, message: "Author not found" });
    }
  });

  getBooksByAuthor.then((booksList) => {
    res.send(JSON.stringify(booksList, null, 4));
  }).catch((err) => {
    res.status(err.status || 500).json({ message: err.message });
  });
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });
  if (booksByTitle.length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

// Task 13: Get all books based on title using Promise / async-await
public_users.get('/title/async/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let booksByTitle = [];
    let keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    });
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject({ status: 404, message: "Title not found" });
    }
  });

  getBooksByTitle.then((booksList) => {
    res.send(JSON.stringify(booksList, null, 4));
  }).catch((err) => {
    res.status(err.status || 500).json({ message: err.message });
  });
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
