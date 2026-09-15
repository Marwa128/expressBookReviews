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

public_users.get("/api/books", function (req, res) {
    res.json(books);
  });
  public_users.get("/", async function (req, res) {
    try {
      const response = await axios.get("http://localhost:5000/api/books");
      res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving books"
      });
    }
  });
// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get("http://localhost:5000/");
      const book = response.data[isbn];
  
      if (!book) {
        return res.status(404).json({
          message: "Book not found"
        });
      }
  
      res.send(JSON.stringify(book, null, 4));
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving book details"
      });
    }
  });
  
// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get("https://github.com/Marwa128/expressBookReviews/blob/main/final_project%2Frouter%2Fbooksdb.js");
    const result = Object.keys(response.data)
      .filter((key) => response.data[key].author === author)
      .map((key) => response.data[key]);

    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title;
  
    try {
      const response = await axios.get("http://localhost:5000/api/books");
      const allBooks = response.data;
      const result = [];
  
      Object.keys(allBooks).forEach((key) => {
        if (allBooks[key].title === title) {
          result.push(allBooks[key]);
        }
      });
  
      res.send(JSON.stringify(result, null, 4));
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving books"
      });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
