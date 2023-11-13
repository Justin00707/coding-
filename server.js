const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost', // Replace with your Clever-Cloud database host
  user: 'root', // Replace with your database user
  password: 'Justin333', // Replace with your database password
  database: 'user_management' // Replace with your database name
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create (Post) - Add a new user
app.post('/users', (req, res) => {
  const { name, email, password } = req.body; // Include password for user creation
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  connection.query(sql, [name, email, password], (err, results) => { // Make sure to hash the password in a real application
    if (err) {
      console.error(err);
      res.status(500).send('Error creating new user');
    } else {
      res.status(201).send({ id: results.insertId, name, email });
    }
  });
});

// Read (Get) - Retrieve all users
app.get('/users', (req, res) => {
  const sql = 'SELECT id, name, email FROM users';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving users');
    } else {
      res.status(200).json(results);
    }
  });
});

// Read (Get) - Retrieve a single user by ID
app.get('/users/:id', (req, res) => {
  const sql = 'SELECT id, name, email FROM users WHERE id = ?';
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving user');
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Update (Put) - Update a user's details
app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  connection.query(sql, [name, email, req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating user');
    } else {
      res.status(200).send(`User with ID ${req.params.id} updated successfully.`);
    }
  });
});

// Delete (Delete) - Delete a user
app.delete('/users/:id', (req, res) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting user');
    } else {
      res.status(200).send(`User with ID ${req.params.id} deleted successfully.`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
