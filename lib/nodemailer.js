import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export async function sendContactEmail({ name, email, subject, message }) {
    await transporter.sendMail({
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: subject || `New message from ${name}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
        <h2 style="color: #22d3ee; margin-bottom: 8px;">New Contact Message</h2>
        <hr style="border-color: #1e293b; margin-bottom: 24px;" />
        <p><strong style="color: #94a3b8;">From:</strong> ${name}</p>
        <p><strong style="color: #94a3b8;">Email:</strong> ${email}</p>
        <p><strong style="color: #94a3b8;">Subject:</strong> ${subject || 'No subject'}</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin-top: 16px;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
      </div>
    `,
    });
}

export async function sendSubscribeConfirmation(email) {
    await transporter.sendMail({
        from: `"Himanshu Raj" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'You are now subscribed!',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
        <h2 style="color: #22d3ee;">Welcome aboard!</h2>
        <p>Thanks for subscribing to Himanshu Raj's portfolio updates.</p>
        <p style="color: #94a3b8;">You'll receive updates on new projects, blog posts, and achievements.</p>
        <br/>
        <p style="color: #64748b; font-size: 12px;">You can unsubscribe at any time by replying to this email.</p>
      </div>
    `,
    });
}
