const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new Error('Username/password are missing');
  }
  if (isValid(username)) {
    throw new Error('Username already exists');
  }

  users.push({username, password});
  console.log(users);
  //Write your code here
  return res.status(200).json({ message: 'User added' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here

  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const isbns = Object.keys(books);
  if (isbns.includes(isbn)) {
    return res.status(200).json(books[isbn]);

  }
  throw new Error('No book found with the isbn');
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const books_found = [];
  for (const [isbn, book] of Object.entries(books)) {
    if (author.toLowerCase() === book.author.toLowerCase()) {
      books_found.push(book)
    }
  }
  if (books_found.length > 0) {
    return res.status(200).json(books_found);
  }
  throw new Error('No book found with this author');
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const books_found = [];
  for (const [isbn, book] of Object.entries(books)) {
    if (title.toLowerCase() === book.title.toLowerCase()) {
      books_found.push(book)
    }
  }
  if (books_found.length > 0) {
    return res.status(200).json(books_found);
  }
  throw new Error('No book found with this title');
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const isbns = Object.keys(books);
  if (isbns.includes(isbn)) {
    const details = books[isbn];
    return res.status(200).json(details.reviews);

  }
  throw new Error('No reviews found with this isbn');
});

module.exports.general = public_users;
