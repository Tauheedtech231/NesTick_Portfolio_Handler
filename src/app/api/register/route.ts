import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import mysql from "mysql2/promise";
/* eslint-disable */

/* ================= DB CONFIG ================= */
const dbConfig = {
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
};

/* ================= REGISTER API ================= */
export async function POST(request: NextRequest) {
  let connection;

  try {
    const { fullName, email, password, country } = await request.json();

    // 1️⃣ Validate fields
    if (!fullName || !email || !password || !country) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 2️⃣ DB Connection
    connection = await mysql.createConnection(dbConfig);

    // 3️⃣ Check if email exists
    const [existingUser]: any = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // 4️⃣ Insert user (PASSWORD AS-IS)
    await connection.execute(
      `INSERT INTO users (full_name, email, password, country)
       VALUES (?, ?, ?, ?)`,
      [fullName, email, password, country]
    );

    // 5️⃣ Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 6️⃣ Send welcome email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform",
      html: `
        <h2>Welcome, ${fullName}</h2>
        <p>Your account has been successfully created.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Country:</strong> ${country}</p>
        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/login">
          Login Now
        </a>
      `,
    });

    return NextResponse.json(
      { message: "Registration successful. Email sent." },
      { status: 201 }
    );

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
