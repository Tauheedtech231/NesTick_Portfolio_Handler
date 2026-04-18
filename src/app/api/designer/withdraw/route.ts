/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/withdraw/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { designerId, amount, method, accountDetails } = body;

    if (!designerId || !amount || !method) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount < 10) {
      return NextResponse.json(
        { success: false, error: 'Minimum withdrawal amount is $10' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Check available balance
      const [designerRows] = await connection.execute(
        'SELECT total_earnings FROM designers WHERE id = ?',
        [designerId]
      );
      const designer = (designerRows as any[])[0];
      const availableBalance = designer?.total_earnings || 0;

      if (amount > availableBalance) {
        return NextResponse.json(
          { success: false, error: 'Insufficient balance' },
          { status: 400 }
        );
      }

      // Create withdrawal request
      const [result] = await connection.execute(
        `INSERT INTO designer_withdrawals (designer_id, amount, method, account_details, status, created_at) 
         VALUES (?, ?, ?, ?, 'pending', NOW())`,
        [designerId, amount, method, JSON.stringify({ account: accountDetails })]
      );

      return NextResponse.json({
        success: true,
        message: 'Withdrawal request submitted successfully',
        withdrawalId: (result as any).insertId
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Withdraw API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
}