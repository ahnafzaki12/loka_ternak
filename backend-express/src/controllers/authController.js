const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validasi sederhana
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Semua field wajib diisi" });
        }

        const newUser = await authService.registerUser({ name, email, password });

        // Hapus password dari response agar aman
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            message: "Registrasi berhasil",
            data: userWithoutPassword
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register };