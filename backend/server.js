const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;
const cors = require("cors");

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Set up the MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "oncoinsight", // Match the exact name
  port: 3306 // Port for MySQL
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  // Check if the user exists in the database
  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = results[0];

    // Compare the provided password with the stored hash (if using bcrypt for passwords)
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: "Error comparing passwords." });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Successful login
      res.status(200).json({ message: "Login successful" });
    });
  });
});

// Example route to fetch data from MySQL
app.get("/api/data", (req, res) => {
  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = results[0];

    // Directly compare plain-text passwords (not recommended for production)
    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Successful login
    res.status(200).json({ message: "Login successful" });
  });

});
