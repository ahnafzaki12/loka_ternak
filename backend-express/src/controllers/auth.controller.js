const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');

const register = async (req, res) => {
    try {
        const { name, email, password, roleName = 'WORKER' } = req.body;

        // 1. Validasi input sederhana
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Semua field wajib diisi (name, email, password)' });
        }

        // 2. Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // 3. Hash Password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Pastikan Role tersedia (sesuai schema: ADMIN atau WORKER) [cite: 51, 61]
        // Menggunakan upsert agar otomatis membuat role jika belum ada di database
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });

        // 5. Simpan user baru ke database menggunakan Prisma
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roleId: role.id,
            },
            // Exclude password dari response
            select: {
                id: true,
                name: true,
                email: true,
                role: {
                    select: {
                        name: true,
                    }
                },
                createdAt: true,
            }
        });

        res.status(201).json({
            message: 'Registrasi berhasil',
            data: newUser,
        });

    } catch (error) {
        console.error('Error saat register:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = {
    register,
};