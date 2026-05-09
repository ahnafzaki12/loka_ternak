const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Agar bisa menerima body format JSON

// Route Contoh
app.get('/api/halo', (req, res) => {
    res.json({ pesan: "Halo dari Express JS" });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});