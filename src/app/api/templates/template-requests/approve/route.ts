import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

const dbConfig = {
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
};

export async function GET(request: NextRequest) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    connection = await mysql.createConnection(dbConfig);

    let query = 'SELECT * FROM template_requests';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    // ✅ FIXED: correct column name
    query += ' ORDER BY submitted_at DESC';

    const [rows] = await connection.execute(query, params);
    const requests = rows as any[];

    // Attach hasCredentials flag
    const enrichedRequests = [];

    for (const request of requests) {
      const [credRows] = await connection.execute(
        'SELECT 1 FROM college_credentials WHERE template_request_id = ? LIMIT 1',
        [request.id]
      );

      enrichedRequests.push({
        ...request,
        hasCredentials: (credRows as any[]).length > 0
      });
    }

    // If approved → hide ones that already have credentials
    const finalRequests =
      status === 'approved'
        ? enrichedRequests.filter(r => !r.hasCredentials)
        : enrichedRequests;

    return NextResponse.json({
      success: true,
      count: finalRequests.length,
      requests: finalRequests
    });

  } catch (error: any) {
    console.error('Error fetching template requests:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch template requests',
        error: error.message
      },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
