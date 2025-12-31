const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database File if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
        branches: [],
        users: [],
        services: [],
        inventory: [],
        sales: []
    }));
}

// API: Get Data
app.get('/api/database', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DB_FILE));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error reading database' });
    }
});

// API: Save Data (Overwrite)
app.post('/api/database', (req, res) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2));
        res.json({ message: 'Database updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error writing database' });
    }
});

// Fallback for SPA routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});