import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

/* eslint-disable */

// MySQL connection pool
const pool = mysql.createPool({
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// CORS Response Helper
function jsonResponse(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Handle OPTIONS (CORS Preflight)
export function OPTIONS() {
  return jsonResponse({ message: "CORS preflight OK" }, 200);
}

export async function POST(request: NextRequest) {
  try {
    const { template_id, section_name, content } = await request.json();

    if (!template_id || !section_name || !content) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    const connection = await pool.getConnection();

    try {
      // Check if section exists
      const [existing] = await connection.execute<RowDataPacket[]>(
        "SELECT id FROM portfolio_sections WHERE template_id = ? AND section_name = ?",
        [template_id, section_name]
      );

      if (existing.length > 0) {
        const sectionId = existing[0].id;

        await connection.execute(
          "UPDATE portfolio_sections SET content = ? WHERE id = ?",
          [JSON.stringify(content), sectionId]
        );

        return jsonResponse({ message: "Section updated", id: sectionId, action: "updated" });
      } else {
        const [result] = await connection.execute(
          "INSERT INTO portfolio_sections (template_id, section_name, content) VALUES (?, ?, ?)",
          [template_id, section_name, JSON.stringify(content)]
        );

        return jsonResponse({ message: "Section created", id: (result as any).insertId, action: "created" });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("DB error:", error);
    return jsonResponse({ error: "Failed to save section" }, 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const template_id = searchParams.get("template_id");
    const section_name = searchParams.get("section_name");

    const connection = await pool.getConnection();

    try {
      let query = "SELECT * FROM portfolio_sections WHERE 1=1";
      const params: any[] = [];

      if (template_id) {
        query += " AND template_id = ?";
        params.push(parseInt(template_id));
      }

      if (section_name) {
        query += " AND section_name = ?";
        params.push(section_name);
      }

      const [rows] = await connection.execute<RowDataPacket[]>(query, params);

      const sections = rows.map((row) => ({
        id: row.id,
        template_id: row.template_id,
        section_name: row.section_name,
        content: typeof row.content === "string" ? JSON.parse(row.content) : row.content,
        created_at: row.created_at,
      }));

      return jsonResponse({ sections });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("DB error:", error);
    return jsonResponse({ error: "Failed to fetch sections" }, 500);
  }
}
