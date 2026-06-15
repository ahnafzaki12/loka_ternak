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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #1f2937;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
                
                <!-- Header / Accent Bar -->
                <div style="background-color: #16a34a; height: 6px; width: 100%;"></div>
                
                <!-- Body Content -->
                <div style="padding: 40px 32px;">
                    <!-- Brand Name / Logo Placeholder -->
                    <h1 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 700; color: #16a34a; letter-spacing: -0.5px;">
                        LokaTernak
                    </h1>
                    
                    <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #111827; line-height: 1.4;">
                        Permintaan Reset Password
                    </h2>
                    
                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                        Halo <strong>${name}</strong>,<br>
                        Kami menerima permintaan untuk mengatur ulang kata sandi akun LokaTernak kamu. Silakan klik tombol di bawah ini untuk melanjutkan:
                    </p>
                    
                    <!-- Button CTA -->
                    <div style="margin: 32px 0; text-align: center;">
                        <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2); transition: background-color 0.2s;">
                            Reset Password
                        </a>
                    </div>
                    
                    <!-- Expiry Alert Callout -->
                    <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 14px; color: #15803d;">
                            <strong>Catatan:</strong> Link ini hanya berlaku selama <strong>15 menit</strong> demi keamanan akunmu.
                        </p>
                    </div>
                    
                    <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                        Jika kamu tidak meminta tindakan ini, abaikan saja email ini dengan aman. Password kamu tidak akan berubah.
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 0 0 20px 0;">
                    
                    <!-- Fallback Link -->
                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; word-break: break-all;">
                        Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut ke browser kamu:<br>
                        <a href="${resetLink}" style="color: #16a34a; text-decoration: underline;">${resetLink}</a>
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                        &copy; ${new Date().getFullYear()} LokaTernak. All rights reserved.
                    </p>
                </div>
                
            </div>
        </div>
    `,
    });
};

module.exports = {
    sendResetPasswordEmail,
};
