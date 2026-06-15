const express = require('express');
const router = express.Router();
const ternakController = require('../controllers/ternakController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Gunakan authMiddleware untuk melindungi route (semua route di bawah ini wajib login)
router.use(authMiddleware);

router.post('/', upload.single('gambar'), ternakController.createTernak);
router.get('/', ternakController.getAllTernak);
router.get('/:id', ternakController.getTernakById);
router.put('/:id', upload.single('gambar'), ternakController.updateTernak);
router.delete('/:id', ternakController.deleteTernak);

module.exports = router;
