const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./src/routes/authRoutes');
const ternakRoutes = require('./src/routes/ternakRoutes');
const port = 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ternak', ternakRoutes);

app.get('/', (req, res) => {
    res.send('LokaTernak API is Berjalan...');
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});