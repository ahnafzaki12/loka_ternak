const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');

const registerUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return await prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        },
    });
};

module.exports = { registerUser };