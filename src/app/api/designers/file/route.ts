/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const query = 'SELECT cv_file, cv_filename FROM designers WHERE id = ?';
    const [rows] = await pool.execute(query, [parseInt(id)]);
    const data = (rows as any[])[0];

    if (!data) {
      return NextResponse.json({ error: 'Designer not found' }, { status: 404 });
    }

    const fileData = data.cv_file;
    const originalFileName = data.cv_filename;

    if (!fileData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // Extract base64 content
    let base64Content = fileData;
    if (fileData.includes(',')) {
      base64Content = fileData.split(',')[1];
    }
    
    const buffer = Buffer.from(base64Content, 'base64');
    
    let mimeType = 'application/octet-stream';
    if (originalFileName?.toLowerCase().endsWith('.pdf')) mimeType = 'application/pdf';
    else if (originalFileName?.toLowerCase().endsWith('.doc')) mimeType = 'application/msword';
    else if (originalFileName?.toLowerCase().endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (originalFileName?.toLowerCase().endsWith('.jpg') || originalFileName?.toLowerCase().endsWith('.jpeg')) mimeType = 'image/jpeg';
    else if (originalFileName?.toLowerCase().endsWith('.png')) mimeType = 'image/png';
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${originalFileName || 'cv_file'}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('File fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}