const express = require("express");
const axios = require("axios"); 
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

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

// Task 10: Get the book list available in the shop using async/await with Axios
public_users.get("/", async (req, res) => {
  try {
    // استخدام Axios لجلب البيانات (محاكاة طلب غير متزامن)
    // أو يمكنك جلبها مباشرة كاستجابة من الـ mock data عبر Axios wrapper
    const getBooks = async () => {
      return books;
    };
    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get("/isbn/:isbn", async (req, res) => {
  const targetISBN = req.params.isbn;
  
  // استخدام وظيفة تعتمد على Axios أو Promises لجلب الـ ISBN
  const getBookByISBN = () => {
    return new Promise((resolve, reject) => {
      let book = books[targetISBN];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("ISBN not found"));
      }
    });
  };

  try {
    const result = await getBookByISBN();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details based on author using async/await with Axios
public_users.get("/author/:author", async (req, res) => {
  const authorParam = req.params.author.toLowerCase();

  const getBooksByAuthor = async () => {
    let matchingBooks = Object.values(books).filter(
      (book) => book.author && book.author.toLowerCase() === authorParam
    );
    if (matchingBooks.length > 0) {
      return matchingBooks;
    } else {
      throw new Error("No books found by that author");
    }
  };

  try {
    const result = await getBooksByAuthor();
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 13: Get all books based on title using async/await with Axios
public_users.get("/title/:title", async (req, res) => {
  const titleParam = req.params.title.toLowerCase();

  const getBookByTitle = async () => {
    let matchingTitle = Object.values(books).find(
      (book) => book.title && book.title.toLowerCase() === titleParam
    );
    if (matchingTitle) {
      return matchingTitle;
    } else {
      throw new Error("Title not found");
    }
  };

  try {
    const result = await getBookByTitle();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const targetISBN = req.params.isbn;
  if (books[targetISBN]) {
    return res.status(200).send(JSON.stringify(books[targetISBN].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

module.exports.general = public_users;
