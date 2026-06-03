const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');

const registerUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return await prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'WORKER',
        },
    });
};

const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Email atau password salah');
    }

    return user;
};

const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true }
    });
};

module.exports = { registerUser, loginUser, getUserById };
