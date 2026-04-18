/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/earnings/route.ts
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
    const designerId = searchParams.get('designerId');

    console.log('📥 Earnings API called for designerId:', designerId);

    if (!designerId) {
      return NextResponse.json(
        { success: false, error: 'Designer ID required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Get designer total earnings
      const [designerRows] = await connection.execute(
        'SELECT total_earnings FROM designers WHERE id = ?',
        [designerId]
      );
      const designer = (designerRows as any[])[0];
      const totalEarnings = designer?.total_earnings || 0;

      console.log('💰 Total earnings:', totalEarnings);

      // Get sales transactions
      const [salesRows] = await connection.execute(
        `SELECT ds.*, dd.title as design_title 
         FROM designer_sales ds
         JOIN designer_designs dd ON ds.design_id = dd.id
         WHERE ds.designer_id = ? 
         ORDER BY ds.purchased_at DESC
         LIMIT 20`,
        [designerId]
      );
      const sales = salesRows as any[];
      
      const completedSales = sales.filter(s => s.status === 'completed');
      const pendingSales = sales.filter(s => s.status === 'pending');
      
      const totalSales = completedSales.length;
      const pendingEarnings = pendingSales.reduce((sum, s) => sum + (s.designer_earning || 0), 0);
      
      // Calculate monthly earnings (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyEarnings = completedSales
        .filter(s => {
          const saleDate = new Date(s.purchased_at);
          return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        })
        .reduce((sum, s) => sum + (s.designer_earning || 0), 0);
      
      const availableBalance = totalEarnings - pendingEarnings;

      // Format transactions
      const transactions = sales.map(s => ({
        id: s.id,
        designTitle: s.design_title,
        amount: s.designer_earning || s.amount,
        date: s.purchased_at,
        status: s.status,
        buyer: s.buyer_name || 'Anonymous'
      }));

      // Get withdrawal history
      const [withdrawalRows] = await connection.execute(
        `SELECT * FROM designer_withdrawals 
         WHERE designer_id = ? 
         ORDER BY created_at DESC 
         LIMIT 20`,
        [designerId]
      );
      const withdrawals = withdrawalRows as any[];
      
      const withdrawalHistory = withdrawals.map(w => ({
        id: w.id,
        amount: w.amount,
        date: w.created_at,
        method: w.method,
        status: w.status
      }));

      console.log('✅ Earnings data fetched successfully');

      return NextResponse.json({
        success: true,
        totalEarnings,
        pendingEarnings,
        monthlyEarnings,
        totalSales,
        availableBalance,
        transactions,
        withdrawalHistory
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Earnings API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch earnings data' },
      { status: 500 }
    );
  }
}