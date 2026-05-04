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
    const type = searchParams.get('type');

    console.log('File request received:', { id, type });

    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }

    let query = '';
    const fileName = '';

    if (type === 'proposal') {
      query = 'SELECT proposal_file, proposal_filename FROM partners WHERE id = ?';
    } else if (type === 'cv') {
      query = 'SELECT cv_file, cv_filename FROM partners WHERE id = ?';
    } else {
      return NextResponse.json({ error: 'Invalid type. Use "proposal" or "cv"' }, { status: 400 });
    }

    const [rows] = await pool.execute(query, [parseInt(id)]);
    const data = (rows as any[])[0];

    console.log('Query result:', data ? 'Found' : 'Not found');

    if (!data) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    const fileData = type === 'proposal' ? data.proposal_file : data.cv_file;
    const originalFileName = type === 'proposal' ? data.proposal_filename : data.cv_filename;

    console.log('File data exists:', !!fileData);
    console.log('Filename:', originalFileName);

    if (!fileData) {
      return NextResponse.json({ error: 'File not found in database' }, { status: 404 });
    }

    // Extract base64 content
    let base64Content = fileData;
    if (fileData.includes(',')) {
      base64Content = fileData.split(',')[1];
    }
    
    const buffer = Buffer.from(base64Content, 'base64');
    
    // Detect mime type
    let mimeType = 'application/octet-stream';
    if (originalFileName?.toLowerCase().endsWith('.pdf')) mimeType = 'application/pdf';
    else if (originalFileName?.toLowerCase().endsWith('.doc')) mimeType = 'application/msword';
    else if (originalFileName?.toLowerCase().endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (originalFileName?.toLowerCase().endsWith('.jpg') || originalFileName?.toLowerCase().endsWith('.jpeg')) mimeType = 'image/jpeg';
    else if (originalFileName?.toLowerCase().endsWith('.png')) mimeType = 'image/png';
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${originalFileName || 'document'}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('File fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}