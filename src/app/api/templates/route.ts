import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "72.61.117.188",   // VPS IP
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
 
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT id, name, description FROM templates"
    );
    await connection.end();

    return NextResponse.json(rows);
  } catch (err) {
    // 🔹 Print full error in server terminal
    console.error("MySQL Error:", err);

    // 🔹 Send error to client
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
