const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE breaches (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, data_year INTEGER, total_breaches INTEGER)`);
    // Example data insertion
    db.run(`INSERT INTO breaches (name, data_year, total_breaches) VALUES (?, ?, ?)`, ['Example Breach', 2022, 5000]);
});

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to search breaches
app.get('/breaches/search', (req, res) => {
    const { name } = req.query;
    db.all(`SELECT * FROM breaches WHERE name LIKE ?`, [`%${name}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint to get statistics of breaches
app.get('/breaches/statistics', (req, res) => {
    db.get(`SELECT COUNT(*) AS totalBreaches FROM breaches`, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
