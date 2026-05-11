const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./src/routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend berjalan!');
});

// Gunakan Auth Routes 
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server berjalan di http://127.0.0.1:${PORT}`);
});