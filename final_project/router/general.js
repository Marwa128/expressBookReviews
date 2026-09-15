const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  res.status(201).json({
    message: "User successfully registered. Now you can login"
  });

});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/books");
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get("رابط مصدر الكتب في مشروعك");
    const result = Object.keys(response.data)
      .filter((key) => response.data[key].author === author)
      .map((key) => response.data[key]);

    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = [];
  const keys = Object.keys(books);

  for (let i = 0; i < keys.length; i++) {
    const book = books[keys[i]];

    if (book.title === title) {
      booksByTitle.push(book);
    }
  }

  res.send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
