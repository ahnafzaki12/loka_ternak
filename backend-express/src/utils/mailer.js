const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST || 'live.smtp.mailtrap.io',
        port: Number(process.env.MAILTRAP_PORT || 587),
        secure: false,
        auth: {
            user: process.env.MAILTRAP_USER || 'api',
            pass: process.env.MAILTRAP_TOKEN,
        },
    });
};

const sendResetPasswordEmail = async ({ to, name, resetLink }) => {
    if (!process.env.MAILTRAP_TOKEN) {
        throw new Error('MAILTRAP_TOKEN belum diatur di file .env');
    }

    const transporter = createTransporter();
    const fromEmail = process.env.MAIL_FROM_EMAIL || 'noreply@lokaternak.com';
    const fromName = process.env.MAIL_FROM_NAME || 'LokaTernak';

    return await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject: 'Reset Password LokaTernak',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Reset Password LokaTernak</h2>
                <p>Halo ${name},</p>
                <p>Kami menerima permintaan untuk reset password akun LokaTernak kamu.</p>
                <p>
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 16px; background: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        Reset Password
                    </a>
                </p>
                <p>Link ini berlaku selama 15 menit.</p>
                <p>Jika kamu tidak meminta reset password, abaikan email ini.</p>
                <p>${resetLink}</p>
            </div>
        `,
    });
};

module.exports = {
    sendResetPasswordEmail,
};
