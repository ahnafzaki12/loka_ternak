const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend berjalan!');
});

app.get('/api/halo', (req, res) => {
    res.json({
        pesan: 'Halo dari Express JS'
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://127.0.0.1:${PORT}`);
});