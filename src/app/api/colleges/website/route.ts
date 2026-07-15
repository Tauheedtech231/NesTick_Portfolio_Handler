/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/colleges/website/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 60000,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ✅ GET: Fetch college website by ID (query param)
export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const collegeId = searchParams.get('college_id');
    
    console.log(`📥 [Website API] Fetching website for college: ${collegeId}`);
    
    if (!collegeId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'college_id query parameter is required' 
        },
        { status: 400, headers: corsHeaders }
      );
    }
    
    connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      `SELECT id, name, website FROM colleges WHERE id = ?`,
      [collegeId]
    );
    
    const college = (rows as any[])[0];
    
    if (!college) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'College not found' 
        },
        { status: 404, headers: corsHeaders }
      );
    }
    
    console.log(`✅ [Website API] Website: ${college.website || 'Not set'}`);
    
    return NextResponse.json({
      success: true,
      data: {
        id: college.id,
        name: college.name,
        website: college.website || null
      }
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('❌ [Website API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500, headers: corsHeaders }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}