const express = require('express');
const app = express();
const authRoutes = require('./src/routes/authRoutes');
const port = 5001;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('LokaTernak API is Berjalan...');
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});