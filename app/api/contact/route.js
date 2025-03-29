import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const { name,mobile, email, message } = await request.json();

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "themancode7@gmail.com",
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nMobile:${mobile}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a73e8;">New Contact Form Submission</h2>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${mobile}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></p>
          <p style="margin: 10px 0;"><strong>Message:</strong> ${message}</p>
          <footer style="margin-top: 20px; font-size: 12px; color: #666;">
            Sent from Contact Form | ${new Date().toLocaleString()}
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}