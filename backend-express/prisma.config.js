// Gunakan require untuk dotenv
require('dotenv').config();

module.exports = {
  // Prisma 7 membutuhkan konfigurasi datasource secara eksplisit 
  // jika url dihapus dari schema.prisma
  datasource: {
    url: process.env.DATABASE_URL,
  },
};