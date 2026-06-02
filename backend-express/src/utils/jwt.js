const crypto = require('crypto');

const JWT_EXPIRES_IN_SECONDS = 24 * 60 * 60;

const base64UrlEncode = (value) => {
    return Buffer.from(JSON.stringify(value))
        .toString('base64url');
};

const base64UrlDecode = (value) => {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
};

const signPart = (value, secret) => {
    return crypto
        .createHmac('sha256', secret)
        .update(value)
        .digest('base64url');
};

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET belum diatur di file .env');
    }

    return process.env.JWT_SECRET;
};

const generateToken = (payload) => {
    const now = Math.floor(Date.now() / 1000);
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const body = {
        ...payload,
        iat: now,
        exp: now + JWT_EXPIRES_IN_SECONDS,
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedBody = base64UrlEncode(body);
    const unsignedToken = `${encodedHeader}.${encodedBody}`;
    const signature = signPart(unsignedToken, getJwtSecret());

    return `${unsignedToken}.${signature}`;
};

const verifyToken = (token) => {
    const [encodedHeader, encodedBody, signature] = token.split('.');

    if (!encodedHeader || !encodedBody || !signature) {
        throw new Error('Token tidak valid');
    }

    const unsignedToken = `${encodedHeader}.${encodedBody}`;
    const expectedSignature = signPart(unsignedToken, getJwtSecret());

    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
        signatureBuffer.length !== expectedSignatureBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
        throw new Error('Token tidak valid');
    }

    const payload = base64UrlDecode(encodedBody);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token sudah expired');
    }

    return payload;
};

module.exports = {
    JWT_EXPIRES_IN_SECONDS,
    generateToken,
    verifyToken,
};
