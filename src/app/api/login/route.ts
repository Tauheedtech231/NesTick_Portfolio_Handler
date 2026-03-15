import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

/* eslint-disable */

export async function POST(req: Request) {
  try {
    console.log("---- Admin Login API Called ----");

    // Print ENV variables
    console.log("ENV CHECK:");
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_NAME:", process.env.DB_NAME);

    const { email, password } = await req.json();

    console.log("Request Data:", { email });

    if (!email || !password) {
      console.log("Validation failed: missing email/password");

      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      );
    }

    console.log("Connecting to MySQL...");

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306,
      connectTimeout: 10000
    });

    console.log("✅ MySQL Connected Successfully");

    // Query admin
    console.log("Running query...");
    const [rows]: any = await connection.execute(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    console.log("Query result:", rows);

    if (rows.length === 0) {
      console.log("Admin not found");

      return NextResponse.json({
        success: false,
        message: "Admin not found",
      });
    }

    const admin = rows[0];

    console.log("Admin found:", admin.email);

    if (admin.password !== password) {
      console.log("Password mismatch");

      return NextResponse.json({
        success: false,
        message: "Invalid password",
      });
    }

    console.log("✅ Admin login successful");

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });

  } catch (error: any) {
    console.error("❌ Admin login error:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Stack:", error.stack);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}