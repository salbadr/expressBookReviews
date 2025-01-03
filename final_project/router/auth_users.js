const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [
  { username: 'john009', password: '111111' },
  { username: 'rob989', password: '222222' },
  { username: 'jane678', password: '333333' },
  { username: 'ash333', password: '444444' }
];

const isValid = (username) => { //returns boolean
  const userExist = users.find(user => user.username === username);
  console.log(userExist);
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
    req.session.username = username;
    const token = jwt.sign({ username }, 'fingerprint_customer')
    return res.status(200).json({ token });

  }
  //Write your code here
  throw new Error('User does not exist');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
