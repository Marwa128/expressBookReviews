const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if a user with the given username already exists
const isValid = (username) => {
  const matchingUsers = users.filter((user) => user.username === username);
  return matchingUsers.length > 0;
};

// Check if user credentials match records
const authenticatedUser = (username, password) => {
  const validUsers = users.filter((user) => user.username === username && user.password === password);
  return validUsers.length > 0;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store token and username in session
    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };
    
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  
  // Fix: retrieve username correctly from session authorization object
  const username = req.session.authorization ? req.session.authorization.username : null;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (books[isbn]) {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated successfully.` });
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Fix: retrieve username correctly from session authorization object
  const username = req.session.authorization ? req.session.authorization.username : null;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (books[isbn]) {
    let book = books[isbn];
    if (book.reviews && book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ message: `Review for the book with ISBN ${isbn} deleted successfully.` });
    } else {
      return res.status(404).json({ message: "Review not found for this user." });
    }
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
