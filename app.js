const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');


const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'banking'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(session({
    secret: 'your-secret-key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/fundtransfer', (req, res) => {
    res.render('fundtransfer');
});

app.get('/successreg', (req, res) => {
    res.render('successreg');
});

app.post('/register', (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Validate input (you can add more validation as needed)
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send('All fields are required');
    }

    // Insert the customer into the database with the plain text password
    const insertQuery = 'INSERT INTO customers (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [first_name, last_name, email, password], (err, results) => {
        if (err) {
            console.error('Error inserting customer:', err);
            return res.status(500).send('Registration failed');
        }
        res.redirect('/successreg')
    });
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input (you can add more validation as needed)
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    // Query the database to find the user with the provided email and password
    const findUserQuery = 'SELECT * FROM customers WHERE email = ? AND password = ?';
    db.query(findUserQuery, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Login failed');
        }

        if (results.length === 0) {
            return res.redirect('/login-error');
			//return res.status(401).send('User not found or incorrect password');
			
        }

        // User found, set the user in the session
        const user = results[0];
        req.session.user = user;

        res.redirect('/dashboard'); // Redirect to the dashboard route
    });
});

app.get('/accountdetails', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Fetch the user's profile and account details from the database
    const user = req.session.user;

    // Query the database to fetch the user's profile and account details using a JOIN
    const fetchDetailsQuery = 'SELECT c.customer_id, c.first_name, c.last_name, c.email, a.account_id, a.account_type, a.balance ' +
                              'FROM customers c ' +
                              'INNER JOIN account a ON c.customer_id = a.customer_id ' +
                              'WHERE c.customer_id = ?';

    db.query(fetchDetailsQuery, [user.customer_id], (err, results) => {
        if (err) {
            console.error('Error fetching profile and account details:', err);
            return res.status(500).send('Failed to fetch details');
        }

        const record = results[0]; // Assuming there's only one matching record

        res.render('accountdetails', { record });
    });
});


app.get('/transactions', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Fetch the user's ID from the session
    const user = req.session.user;

    // Query the database to fetch merged records from transactions and bills
    const mergeRecordsQuery = 'SELECT t.transaction_id, t.sender_id, t.receiver_id, t.amount, t.transaction_type, t.transaction_date, ' +
                              'b.bill_id, b.bill_type, b.account_number, b.amount as bill_amount, b.customer_id, b.payment_date ' +
                              'FROM transactions t ' +
                              'LEFT JOIN bills b ON t.sender_id = b.customer_id ' +
                              'WHERE t.sender_id = ?';

    db.query(mergeRecordsQuery, [user.customer_id], (err, results) => {
        if (err) {
            console.error('Error fetching merged records:', err);
            return res.status(500).send('Failed to fetch records');
        }

        const mergedRecords = results;

        res.render('transactions', { mergedRecords });
    });
});


app.get('/fundtransfer', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('fundtransfer');
});

app.post('/fundtransfer', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const { receiver, amount } = req.body;
    const senderId = req.session.user.customer_id;

    // Validate input (you can add more validation as needed)
    if (!receiver || !amount) {
        return res.status(400).send('Receiver and amount are required');
    }

    // Query the database to perform the fund transfer
    const transferQuery = 'INSERT INTO transactions (sender_id, receiver_id, amount, transaction_type, transaction_date) VALUES (?, ?, ?, ?, NOW())';
    db.query(transferQuery, [senderId, receiver, amount, 'Transfer'], (err, result) => {
        if (err) {
            console.error('Error performing fund transfer:', err);
            return res.status(500).send('Fund transfer failed');
        }

        res.send('Fund transfer successful');
    });
});

app.get('/statement', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Fetch the user's account statement from the database
    const user = req.session.user;

    // Query the database to fetch the user's account statement based on sender_id
    const fetchStatementQuery = 'SELECT * FROM transactions WHERE sender_id = ?';
    db.query(fetchStatementQuery, [user.customer_id], (err, results) => {
        if (err) {
            console.error('Error fetching account statement:', err);
            return res.status(500).send('Failed to fetch account statement');
        }

        const transactions = results;

        res.render('statement', { transactions });
    });
});


app.get('/billpay', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('billpay');
});
app.post('/billpay', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const { billType, accountNumber, amount } = req.body;
    const customer = req.session.user;

    // Validate input (you can add more validation as needed)
    if (!billType || !accountNumber || !amount) {
        return res.status(400).send('Bill type, account number, and amount are required');
    }

    // Query the database to insert the bill payment
    const paymentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const insertPaymentQuery = 'INSERT INTO bills (bill_type, account_number, amount, customer_id, payment_date) VALUES (?, ?, ?, ?, ?)';
    db.query(insertPaymentQuery, [billType, accountNumber, amount, customer.customer_id, paymentDate], (err, result) => {
        if (err) {
            console.error('Error making bill payment:', err);
            return res.status(500).send('Bill payment failed');
        }

        // Update the customer's balance
        const updateBalanceQuery = 'UPDATE account SET balance = balance - ? WHERE customer_id = ?';
        db.query(updateBalanceQuery, [amount, customer.customer_id], (err, updateResult) => {
            if (err) {
                console.error('Error updating balance:', err);
                return res.status(500).send('Failed to update balance');
            }

            // Respond with a success message
            res.send('Bill payment successful');
        });
    });
});

app.get('/createaccount', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('createaccount');
});
/*
app.post('/createaccount', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const { accountType, balance } = req.body;
    const customer = req.session.user;

    // Validate input (you can add more validation as needed)
    if (!accountType || !balance) {
        return res.status(400).send('Account type and initial balance are required');
    }

    // Query the database to insert the new account
    const insertAccountQuery = 'INSERT INTO account (customer_id, account_type, balance) VALUES (?, ?, ?)';
    db.query(insertAccountQuery, [customer.customer_id, accountType, balance], (err, result) => {
        if (err) {
            console.error('Error creating account:', err);
            return res.status(500).send('Account creation failed');
        }

        // Respond with a success message
        res.redirect('/dashboard');
    });
});
*/

app.post('/createaccount', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const { accountType, balance } = req.body;
    const customer = req.session.user;

    // Validate input (you can add more validation as needed)
    if (!accountType || !balance) {
        return res.status(400).send('Account type and initial balance are required');
    }

    // Check if the account already exists for the customer
    const checkAccountQuery = 'SELECT * FROM account WHERE customer_id = ? AND account_type = ?';
    db.query(checkAccountQuery, [customer.customer_id, accountType], (err, results) => {
        if (err) {
            console.error('Error checking account:', err);
            return res.status(500).send('Account creation failed');
        }

        if (results.length > 0) {
            // Account already exists, return an error message
            return res.status(400).send('Account already exists for this type');
        }

        // Account doesn't exist, proceed with creating a new one
        const insertAccountQuery = 'INSERT INTO account (customer_id, account_type, balance) VALUES (?, ?, ?)';
        db.query(insertAccountQuery, [customer.customer_id, accountType, balance], (err, result) => {
            if (err) {
                console.error('Error creating account:', err);
                return res.status(500).send('Account creation failed');
            }

            // Respond with a success message
            res.redirect('/dashboard');
        });
    });
});

app.get('/viewbills', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Fetch the user's bills from the database
    const user = req.session.user;

    // Query the database to fetch the user's bills
    const fetchBillsQuery = 'SELECT * FROM bills WHERE customer_id = ?';
    db.query(fetchBillsQuery, [user.customer_id], (err, results) => {
        if (err) {
            console.error('Error fetching bills:', err);
            return res.status(500).send('Failed to fetch bills');
        }

        const bills = results;

        // Render the viewbills.ejs template with bill data
        res.render('viewbills', { bills });
    });
});


app.get('/logout', (req, res) => {
    // Clear the user session to log them out
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.render('logout'); // Render the "logout.ejs" template
    });
});


app.get('/feedback', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('feedback');
});

app.post('/feedback', (req, res) => {
    // Check if the user is authenticated in the session
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const { feedbackText } = req.body;
    const customer = req.session.user;

    // Validate input (you can add more validation as needed)
    if (!feedbackText) {
        return res.status(400).send('Feedback text is required');
    }

    // Query the database to insert the feedback
    const insertFeedbackQuery = 'INSERT INTO feedback (customer_id, feedback_text) VALUES (?, ?)';
    db.query(insertFeedbackQuery, [customer.customer_id, feedbackText], (err, result) => {
        if (err) {
            console.error('Error submitting feedback:', err);
            return res.status(500).send('Failed to submit feedback');
        }

        res.send('Feedback submitted successfully');
    });
});

app.get('/contactus', (req, res) => {
    // You can add additional logic here if needed
    res.render('contactus');
});

// Assuming you're using Express.js
app.get('/login-error', (req, res) => {
    const errorMessage = 'Invalid username or password';
    res.render('loginError.ejs', { errorMessage });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
