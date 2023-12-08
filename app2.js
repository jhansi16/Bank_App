const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const db = require('./db'); // Import the MySQL connection configuration

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('views'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Login route
app.get('/login', (req, res) => {
    res.render('login');
});

// Login route
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});


app.get('/register', (req, res) => {
    res.render('register');
});


app.get('/transactions', (req, res) => {
    res.render('transactions');
});


// Handle transaction form submission
app.post('/transaction', (req, res) => {
    const { accountnumber, TransactionType, Amount, Description } = req.body;

    // You should add validation and error handling here for user input.

    // Generate a transaction date (you can use a library like moment.js)
    const TransactionDate = new Date().toISOString();

    // Perform a MySQL query to insert the transaction into the database
    const sql = 'INSERT INTO transactions (accountnumber, TransactionType, Amount, TransactionDate, Description) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [accountnumber, TransactionType, Amount, TransactionDate, Description], (err, result) => {
        if (err) {
            console.error('Error in SQL query:', err);
            // Handle the error (e.g., display an error message)
            res.render('transactions', { error: 'An error occurred while processing your request.' });
        } else {
            // Transaction successful, you can redirect to a transaction history page or another page
            res.redirect('/transaction-history');
        }
    });
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { userid, username, password, usertype } = req.body;

    // You should add validation and error handling here for user input.

    // Perform a MySQL query to insert the user into the database
    const sql = 'INSERT INTO users (UserID, Username, Password, UserType) VALUES (?, ?, ?, ?)';
    db.query(sql, [userid, username, password, usertype], (err, result) => {
        if (err) {
            console.error('Error in SQL query:', err);
            // Handle the error (e.g., display an error message)
            res.render('register', { error: 'An error occurred while processing your request.' });
        } else {
            // Registration successful, you can redirect to a login page or another page
            res.redirect('/login');
        }
    });
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Perform a MySQL query to check if the user exists
    const sql = 'SELECT * FROM users WHERE Username = ?'; // Correct column name
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error in SQL query:', err);
            // Handle the error (e.g., display an error message)
            res.render('login', { error: 'An error occurred while processing your request.' });
        } else if (results.length === 0) {
            // User not found, display an error message
            res.render('login', { error: 'Invalid username or password.' });
        } else {
            // User found, check the password (not secure, use bcrypt in production)
            const user = results[0];

            if (user.Password === password) { // Correct column name
                // Password matches, consider the user logged in
                // Redirect to a dashboard or another page
                res.redirect('/dashboard');
            } else {
                // Password does not match, display an error message
                res.render('login', { error: 'Invalid username or password.' });
            }
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
