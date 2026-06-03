const authService = require('../services/authService');
const {
    JWT_EXPIRES_IN_SECONDS,
    RESET_PASSWORD_EXPIRES_IN_SECONDS,
    generateToken,
    verifyToken,
} = require('../utils/jwt');
const { sendResetPasswordEmail } = require('../utils/mailer');

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

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    res.status(200).json({ message: "Logout berhasil" });
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body || {};

        if (!email) {
            return res.status(400).json({ message: "Email wajib diisi" });
        }

        const user = await authService.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Email tidak terdaftar" });
        }

        const token = generateToken(
            {
                id: user.id,
                email: user.email,
                type: 'reset-password',
            },
            RESET_PASSWORD_EXPIRES_IN_SECONDS
        );
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

        await sendResetPasswordEmail({
            to: user.email,
            name: user.name,
            resetLink,
        });

        res.status(200).json({
            message: "Link reset password berhasil dikirim ke email",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body || {};

        if (!token || !password) {
            return res.status(400).json({ message: "Token dan password wajib diisi" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password minimal 6 karakter" });
        }

        const payload = verifyToken(token);

        if (payload.type !== 'reset-password') {
            return res.status(400).json({ message: "Token reset password tidak valid" });
        }

        const user = await authService.getUserByEmail(payload.email);

        if (!user || user.id !== payload.id) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        await authService.updatePassword({
            userId: user.id,
            password,
        });

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({ message: "Password berhasil direset" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const me = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.status(200).json({
            message: "User berhasil diambil",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    me,
};
