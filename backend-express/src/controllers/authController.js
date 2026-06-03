const authService = require('../services/authService');
const { JWT_EXPIRES_IN_SECONDS, generateToken } = require('../utils/jwt');

const roles = ['OWNER', 'WORKER'];

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body || {};

        // Validasi sederhana
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Semua field wajib diisi" });
        }

        const normalizedRole = role ? role.toUpperCase() : 'WORKER';

        if (!roles.includes(normalizedRole)) {
            return res.status(400).json({ message: "Role tidak valid" });
        }

        const newUser = await authService.registerUser({
            name,
            email,
            password,
            role: normalizedRole,
        });

        // Hapus password dari response agar aman
        const { password: _, ...userWithoutPassword } = newUser;
        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: JWT_EXPIRES_IN_SECONDS * 1000,
        });

        res.status(201).json({
            message: "Registrasi berhasil",
            token,
            data: userWithoutPassword
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: "Email dan password wajib diisi" });
        }

        const user = await authService.loginUser({ email, password });
        const { password: _, ...userWithoutPassword } = user;
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: JWT_EXPIRES_IN_SECONDS * 1000,
        });

        res.status(200).json({
            message: "Login berhasil",
            token,
            data: userWithoutPassword,
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const me = (req, res) => {
    res.status(200).json({
        message: "User berhasil diambil",
        data: req.user,
    });
};

module.exports = { register, login, me };
