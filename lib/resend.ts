import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendOTPEmail = async (email: string, code: string) => {
  if (!resend) {
    return { success: false, error: { message: "verify a domain (API Key Missing)" } };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: 'Stockysee <onboarding@stockysee.com>',
      to: [email],
      subject: 'Kode Verifikasi Akun Stockysee',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #3b82f6;">Halo dari Stockysee!</h2>
          <p>Terima kasih telah mendaftar. Gunakan kode verifikasi di bawah ini untuk melanjutkan pendaftaran Anda:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
            ${code}
          </div>
          <p>Kode ini berlaku selama 10 menit. Jika Anda tidak merasa melakukan pendaftaran ini, silakan abaikan email ini.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">&copy; 2024 Stockysee. Premium Storefront Solution.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Resend Catch Error:", err);
    return { success: false, error: err };
  }
};

export const sendActivationEmail = async (email: string, ownerName: string, username: string, token: string) => {
  if (!resend) {
    return { success: false, error: { message: "Resend API Key Missing" } };
  }
  try {
    const activationUrl = `https://stockysee.com/activate/${token}`;
    
    const { data, error } = await resend.emails.send({
      from: 'Stockysee Support <onboarding@stockysee.com>',
      to: [email],
      subject: 'Selamat! Toko Stockysee Anda Telah Aktif',
      html: `
        <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 24px;">
          <h1 style="color: #2563eb; font-size: 24px; font-weight: 800; margin-bottom: 8px;">Hi ${ownerName}!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Pendaftaran toko Anda telah disetujui! Sekarang Anda bisa mulai membangun storefront premium Anda.</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin: 32px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Detail Login Anda</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <p style="margin: 0; font-size: 14px; color: #1e293b;"><strong>Username:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${username}</code></p>
              <p style="margin: 0; font-size: 14px; color: #1e293b;"><strong>Activation Token:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${token}</code></p>
            </div>
          </div>

          <a href="${activationUrl}" style="display: block; background: #2563eb; color: white; padding: 16px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; text-align: center; font-size: 16px; margin-bottom: 24px;">Aktifkan Akun Sekarang</a>
          
          <p style="font-size: 14px; color: #6b7280;">Jika tombol di atas tidak berfungsi, salin link berikut: <br/> <span style="color: #2563eb; word-break: break-all;">${activationUrl}</span></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; 2024 Stockysee. High Performance Storefront Platform.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Resend Catch Error:", err);
    return { success: false, error: err };
  }
};
