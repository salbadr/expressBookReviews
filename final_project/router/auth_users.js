const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

const users = [
  { username: 'john009', password: '111111' },
  { username: 'rob989', password: '222222' },
  { username: 'jane678', password: '333333' },
  { username: 'ash333', password: '444444' }
];

const isValid = (username) => { //returns boolean
  const userExist = users.find(user => user.username === username);
  return userExist;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const userExist = users.find(user => user.username === username && user.password == password);
  return userExist;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'fingerprint_customer')
    return res.status(200).json({ token });

  }
  //Write your code here
  throw new Error('User does not exist');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const { isbn } = req.params;
  const { username } = req.session;
  const book_to_review = books[isbn];
  book_to_review.reviews = { ...book_to_review.reviews, [username]: review }
  return res.status(200).json({ message: "Review successfully updated" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session;
  const book_to_review = books[isbn];
  const updated_reviews = {}
  for (const [key, value] of Object.entries(book_to_review.reviews)) {
    if (key !== username) {
      updated_reviews[key] = value
    }
  }
  book_to_review.reviews = updated_reviews;

  return res.status(200).json({ message: "Review successfully deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
