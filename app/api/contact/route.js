import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const RECAPTCHA_SECRET_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SECRET_KEY;

export async function POST(request) {
  try {
    const { name, mobile, email, message, recaptchaToken } = await request.json();

    if (!name || !mobile || !email || !message || !recaptchaToken) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Are you a bot?' },
        { status: 403 }
      );
    }

    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_FROM}>`,
      replyTo: email,
      to: process.env.EMAIL_FROM,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nMobile: ${mobile}\nEmail: ${email}\nMessage: ${message}\nreCAPTCHA Score: ${recaptchaData.score}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a73e8;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>reCAPTCHA Score:</strong> ${recaptchaData.score}</p>
          <footer style="margin-top: 20px; font-size: 12px; color: #666;">
            Sent from Contact Form | ${new Date().toLocaleString()}
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}