const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username already exists in the users array
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists. Please choose a different one." });
  }

  // Register the new user
  users.push({ username, password });

  // Return success response
  return res.status(201).json({ message: "User registered successfully!" });


});



// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        // Simulating an asynchronous operation with a Promise, though in this case it's unnecessary
        const data = await new Promise((resolve) => {
            resolve(books);  // Resolving the books object (you can remove this Promise if you don't need async behavior)
        });

        // Sending the books data as a nicely formatted JSON response
        res.status(200).json(data);  // This will send the books in JSON format directly
    } catch (error) {
        // Handling any potential errors that occur during the asynchronous operation
        res.status(500).json({ message: error.message });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Simulating a promise that resolves to the book data
    new Promise((resolve, reject) => {
        const book = books[isbn]; // Fetch the book using ISBN
        if (book) {
            resolve(book); // Resolve the promise if book is found
        } else {
            reject(new Error("Book not found.")); // Reject the promise if book is not found
        }
    })
    .then((data) => {
        res.status(200).json(data); // Send the book data as JSON if resolved
    })
    .catch((error) => {
        res.status(404).json({ message: error.message }); // Handle error (book not found)
    });
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    new Promise((resolve) => {
        let booksByAuthor = [];
        let bookKeys = Object.keys(books);
        for (let i = 0; i < bookKeys.length; i++) // Direct comparison 
        { 
            let book = books[bookKeys[i]];
            if (book.author === author) {
                booksByAuthor.push(book);
            }
        }
        resolve(booksByAuthor);
    })
    .then((data) => {
        res.status(200).json(data); // Return matched books
    })
    .catch((error) => {
        res.status(404).json({ message: `No books found by author ${author}.` }); // No books found
    });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        
        // Filter books by title directly
        const booksByTitle = Object.values(books).filter(book => book.title === title);

        // Check if books are found
        if (booksByTitle.length > 0) {
            res.status(200).json(booksByTitle);
        } else {
            res.status(404).json({ message: `No books found with the title '${title}'.` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters

    // Find the book with the specified ISBN
    const book = books[isbn];

    if (book) {
        res.status(200).json(book.reviews); // Return the reviews of the book if found
    } else {
        res.status(404).json({ message: `No reviews found for the book with ISBN ${isbn}.` }); // If no book with that ISBN is found
    }

});

module.exports.general = public_users;
