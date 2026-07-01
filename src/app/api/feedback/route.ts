// app/api/feedback/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function POST(request: Request) {
  try {
    const { name, email, message, rating } = await request.json();

    const [result] = await pool.execute(
      `INSERT INTO feedback (name, email, message, rating) VALUES (?, ?, ?, ?)`,
      [name, email, message, rating]
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}