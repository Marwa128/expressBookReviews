const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const matchingUsers = registeredUsers.filter(function (user) {
    return user.username === username;
  });

  return matchingUsers.length > 0;
};

const authenticatedUser = (username, password) => {
  const validUsers = users.filter(function (user) {
    return user.username === username && user.password === password;
  });

  return validUsers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  const accessToken = jwt.sign(
    { username: user.username },
    "access"
  );

  req.session.authorization = {
    accessToken: accessToken,
    username: user.username
  };

  res.status(200).json({
    message: "User successfully logged in",
    login: true
  });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  books[isbn].reviews[username] = review;

  res.send(books[isbn]);
});

regd_users.delete("/auth/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({
      message: "User is not authenticated",
    });
  }

  if (!books[isbn] || !books[isbn].reviews) {
    return res.status(404).json({
      message: "Book or reviews not found",
    });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review not found for this user",
    });
  }

  delete books[isbn].reviews[username];

  res.json({
    message: "Review deleted successfully",
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
