const express = require("express");
const axios = require("axios"); // Kept in case it's needed later for async requests
let books = require("./booksdb.js"); // Import the mock book database
let isValid = require("./auth_users.js").isValid; // Import username validation function
let users = require("./auth_users.js").users; // Import the registered users array
const public_users = express.Router();

// Helper function to check if the username already exists in the system
const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

// Function to get all books (simulating an async operation)
const getAllBooks = () => {
  return books;
};

// Register a new user route
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" }); // 400 Bad Request
  } 
  // Check if the username is already registered
  else if (doesExist(username)) {
    return res.status(409).json({ message: "User already exists." }); // 409 Conflict
  } 
  else {
    // Add the new user to the array
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Please login." });
  }
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    // Send the book objects in a formatted JSON structure (indentation = 4)
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const targetISBN = req.params.isbn; // Get ISBN directly as a string to avoid type matching issues
  const targetBook = await books[targetISBN];
  
  if (!targetBook) {
    return res.status(404).json({ message: "ISBN not found." });
  } else {
    return res.status(200).json(targetBook);
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const authorParam = req.params.author.toLowerCase();
  
  // Convert books object values to an array and filter by author (case-insensitive)
  const matchingBooks = Object.values(await books).filter(
    (book) => book.author.toLowerCase() === authorParam
  );
  
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books by that author." });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const titleParam = req.params.title.toLowerCase();
  
  // Find the first book that matches the given title (case-insensitive)
  const matchingTitle = Object.values(await books).find(
    (book) => book.title.toLowerCase() === titleParam
  );
  
  if (matchingTitle) {
    return res.status(200).json(matchingTitle);
  } else {
    return res.status(404).json({ message: "Title not found." });
  }
});

// Get book review based on ISBN
public_users.get("/review/:isbn", function (req, res) {
  const targetISBN = req.params.isbn;
  const targetBook = books[targetISBN];
  
  if (targetBook) {
    // Return only the reviews section of the specific book
    return res.status(200).send(JSON.stringify(targetBook.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

module.exports.general = public_users;
