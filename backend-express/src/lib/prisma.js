require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');

const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
});

const adapter = new PrismaNeon(pool);

const prisma = new PrismaClient({
    adapter,
});

module.exports = prisma;