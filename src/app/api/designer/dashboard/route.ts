/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/dashboard/route.ts
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

    if (!designerId) {
      return NextResponse.json(
        { success: false, error: 'Designer ID required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Get all designs
      const [designs] = await connection.execute(
        `SELECT id, title, status, downloads, likes, created_at 
         FROM designer_designs 
         WHERE designer_id = ?`,
        [designerId]
      );

      const allDesigns = designs as any[];
      
      // Calculate stats
      const total = allDesigns.length;
      const approved = allDesigns.filter(d => d.status === 'approved').length;
      const pending = allDesigns.filter(d => d.status === 'pending').length;
      const rejected = allDesigns.filter(d => d.status === 'rejected').length;
      const totalDownloads = allDesigns.reduce((sum, d) => sum + (d.downloads || 0), 0);
      const totalLikes = allDesigns.reduce((sum, d) => sum + (d.likes || 0), 0);

      // Get designer profile for earnings
      const [profileRows] = await connection.execute(
        `SELECT total_earnings FROM designers WHERE id = ?`,
        [designerId]
      );
      const profile = (profileRows as any[])[0];
      const totalEarnings = profile?.total_earnings || 0;

      // Get recent activities (last 10)
      const recentActivities = allDesigns
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map(d => ({
          id: d.id,
          type: d.status === 'approved' ? 'approved' : d.status === 'rejected' ? 'rejected' : 'uploaded',
          title: d.title,
          date: d.created_at,
          amount: d.status === 'approved' ? 0 : undefined
        }));

      // Get monthly earnings (last 6 months)
      const monthlyEarningsData = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12;
        monthlyEarningsData.push({
          month: months[monthIndex],
          earnings: 0 // Will be updated from sales table when implemented
        });
      }

      return NextResponse.json({
        success: true,
        stats: {
          total,
          approved,
          pending,
          rejected,
          totalEarnings,
          monthlyEarnings: 0,
          totalDownloads,
          totalLikes
        },
        recentActivities,
        monthlyEarnings: monthlyEarningsData
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}