import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

// Database configuration
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
    connection = await mysql.createConnection(dbConfig);

    const query = `
      SELECT
        tr.id AS template_request_id,
        tr.type AS template_type,
        tr.plan AS template_plan,
        tr.status AS request_status,
        tr.submitted_at,

        -- Template details
        t.id AS template_id,
        t.name AS template_name,
        t.description AS template_description,
        t.live_url AS template_live_url,
        t.image AS template_image,

        -- College details
        c.id AS college_id,
        c.name AS college_name,
        c.email AS college_email,
        c.phone AS college_phone,
        c.website AS college_website,
        c.city AS college_city,
        c.country AS college_country,
        c.created_at AS college_created_at,
        c.updated_at AS college_updated_at,

        -- Credentials
        cc.login_email,
        cc.password_hash,
        cc.sent_at

      FROM template_requests tr
      INNER JOIN college_credentials cc
        ON tr.id = cc.template_request_id
      INNER JOIN colleges c
        ON cc.college_id = c.id
      INNER JOIN templates t
        ON tr.template_id = t.id

      WHERE tr.status = 'approved'
      ORDER BY cc.sent_at DESC
    `;

    const [rows] = await connection.execute(query);

    const credentials = (rows as any[]).map(row => ({
      template_request_id: row.template_request_id,
      template: {
        id: row.template_id,
        name: row.template_name,
        type: row.template_type,
        plan: row.template_plan,
        description: row.template_description,
        live_url: row.template_live_url,
        image: row.template_image
      },
      college: {
        id: row.college_id,
        name: row.college_name,
        email: row.college_email,
        phone: row.college_phone,
        website: row.college_website,
        city: row.college_city,
        country: row.college_country,
        created_at: row.college_created_at,
        updated_at: row.college_updated_at
      },
      credentials: {
        login_email: row.login_email,
        password_hash: row.password_hash,
        sent_at: row.sent_at
      }
    }));

    return NextResponse.json({
      success: true,
      message: 'Credentials fetched successfully',
      count: credentials.length,
      data: credentials
    });

  } catch (error: any) {
    console.error('Error fetching credentials:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch credentials',
        error: error.message
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
