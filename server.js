const express = require('express');
const bodyParser = require('body-parser'); // [cite: 37]
const mysql = require('mysql2'); // [cite: 38]
const cors = require('cors'); // [cite: 39]

const app = express(); // [cite: 40]
app.use(cors()); // [cite: 41]
app.use(bodyParser.json()); // [cite: 42]

// Konfigurasi Database [cite: 43-45]
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_ojeksiber'
});

// MIDDLEWARE FORENSIK (Mencatat Jejak Digital) [cite: 47-52]
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toISOString();
    console.log(`[FORENSIC LOG] TIME: ${timestamp} | IP: ${ip} | DEVICE: ${userAgent} | PATH: ${req.path}`);
    next();
});

// LOGIN TIDAK AMAN (Vulnerable to SQL Injection) [cite: 53-65]
app.post('/api/login-vulnerable', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`; // [cite: 59]
    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            res.json({ message: "LOGIN BERHASIL (Vulnerable)", user: results[0] });
        } else {
            res.status(401).json({ message: "Login Gagal" });
        }
    });
});

// LOGIN AMAN (Secure) [cite: 71-76]
app.post('/api/login-secure', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?'; // [cite: 74]
    db.query(query, [username, password], (err, results) => {
        if (results.length > 0) {
            res.json({ message: "LOGIN BERHASIL (Secure)", user: results[0] });
        } else {
            res.status(401).json({ message: "Login Gagal" });
        }
    });
});

// DETEKSI FAKE GPS (Logic Server) [cite: 83-94]
app.post('/api/absen-lokasi', (req, res) => {
    const { isMock } = req.body;
    const ip = req.socket.remoteAddress;
    if (isMock === true) { // [cite: 91]
        console.log(`[ALERT] FAKE GPS DETECTED from IP: ${ip}`); // [cite: 92]
        return res.status(403).json({ message: "DILARANG MENGGUNAKAN TUYUL (Fake GPS)!" });
    }
    res.json({ message: "Absen Lokasi Berhasil Diterima" });
});

app.listen(3000, () => console.log('Server OjekSiber berjalan di port 3000')); // [cite: 95]