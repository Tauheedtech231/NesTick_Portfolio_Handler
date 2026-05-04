/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/withdrawals/route.ts
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const developerId = searchParams.get('developerId');

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT * FROM developer_withdrawals 
         WHERE developer_id = ? 
         ORDER BY created_at DESC`,
        [developerId]
      );

      return NextResponse.json({
        success: true,
        data: rows
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Withdrawals API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, method, accountDetails, developerId } = body;

    if (!amount || !method || !developerId) {
      return NextResponse.json({ success: false, error: 'Amount, method and developerId required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      // Check available balance
      const [balanceRows] = await connection.execute(
        `SELECT COALESCE(SUM(developer_earning), 0) as balance
         FROM developer_sales 
         WHERE developer_id = ? AND status = 'pending'`,
        [developerId]
      );

      const availableBalance = (balanceRows as any[])[0].balance;
      if (amount > availableBalance) {
        return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
      }

      const [result] = await connection.execute(
        `INSERT INTO developer_withdrawals (developer_id, amount, method, account_details, status)
         VALUES (?, ?, ?, ?, 'pending')`,
        [developerId, amount, method, JSON.stringify(accountDetails)]
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
    console.error('Create withdrawal error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create withdrawal request' }, { status: 500 });
  }
}