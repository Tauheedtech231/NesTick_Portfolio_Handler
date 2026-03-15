import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET() {
  let connection;

  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // Fetch full template info
    const [rows] = await connection.execute(
      `SELECT id, name, description, image, live_url, type, created_at
       FROM templates
       ORDER BY created_at DESC`
    );

    // Close connection
    await connection.end();

    // Return full data
    return NextResponse.json({ success: true, templates: rows });

  } catch (err) {
    console.error("MySQL Error:", err);

    if (connection) await connection.end();

    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
