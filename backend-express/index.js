const express = require('express');
const app = express();
const port = 5001;

// Middleware untuk membaca request body berbentuk JSON
app.use(express.json());

// Route dasar (Metode GET)
app.get('/', (req, res) => {
    res.send('Halo! Backend Express-mu berhasil berjalan.');
});

// Contoh route lain dengan metode POST
app.post('/api/data', (req, res) => {
    const dataDariUser = req.body;
    res.json({
        message: 'Data berhasil diterima!',
        data: dataDariUser
    });
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});