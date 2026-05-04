/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/partners/route.ts
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

// GET - Fetch partners
// GET - Fetch partners
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const partnerType = searchParams.get('partnerType');

    let query = `SELECT id, partner_id, partner_type, other_domain, organization_name, contact_person, 
                        email, phone, country, message, links, proposal_filename, proposal_file, 
                        cv_filename, cv_file, status, created_at FROM partners WHERE 1=1`;
    const params: any[] = [];

    if (id) {
      query += ' AND id = ?';
      params.push(parseInt(id));
    }
    if (email) {
      query += ' AND email = ?';
      params.push(email);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (partnerType) {
      query += ' AND partner_type = ?';
      params.push(partnerType);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    
    // Dynamically generate URLs for files
    const processedRows = (rows as any[]).map(row => ({
      ...row,
      proposal_url: row.proposal_file ? `/api/partners/file?id=${row.id}&type=proposal` : null,
      cv_url: row.cv_file ? `/api/partners/file?id=${row.id}&type=cv` : null,
      proposal_file: undefined, // Remove file data from response
      cv_file: undefined // Remove file data from response
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: processedRows,
      count: processedRows.length
    });
  } catch (error) {
    console.error('GET partners error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch partners' }, { status: 500 });
  }
}

// POST - Create new partner with direct database storage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      id,
      partnerType,
      otherDomain,
      organizationName,
      contactPerson,
      email,
      phone,
      country,
      message,
      links,
      proposalFile,
      proposalFileName,
      cvFile,
      cvFileName
    } = body;

    // Validation
    if (!organizationName || !contactPerson || !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Organization name, contact person and email are required' 
      }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await pool.execute('SELECT id FROM partners WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email already registered' 
      }, { status: 409 });
    }

    // Store files directly in database (LONGTEXT columns)
    let proposalData = null;
    let cvData = null;

    if (proposalFile && proposalFileName) {
      proposalData = proposalFile; // Already base64 string
    }

    if (cvFile && cvFileName) {
      cvData = cvFile; // Already base64 string
    }

    // Insert partner with files in database
    const [result] = await pool.execute(
      `INSERT INTO partners (
        partner_id, partner_type, other_domain, organization_name, contact_person, 
        email, phone, country, message, links, proposal_filename, proposal_file, 
        cv_filename, cv_file, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        id || `PART-${Date.now()}`,
        partnerType || null,
        otherDomain || null,
        organizationName,
        contactPerson,
        email,
        phone || null,
        country || null,
        message || null,
        links ? JSON.stringify(links) : null,
        proposalFileName || null,
        proposalData,
        cvFileName || null,
        cvData
      ]
    );

    const insertId = (result as any).insertId;

    // Get inserted record (without file data for response)
    const [newPartner] = await pool.execute(
      `SELECT id, partner_id, partner_type, other_domain, organization_name, contact_person, 
              email, phone, country, message, links, proposal_filename, cv_filename, 
              status, created_at FROM partners WHERE id = ?`,
      [insertId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Partner application submitted successfully. Waiting for review.',
      data: (newPartner as any[])[0]
    }, { status: 201 });

  } catch (error) {
    console.error('POST partner error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit partner application' 
    }, { status: 500 });
  }
}

// GET file endpoint - to retrieve file from database
export async function GET_FILE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const fileType = searchParams.get('type'); // 'proposal' or 'cv'

    if (!id || !fileType) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }

    let query = '';
    let fileName = '';

    if (fileType === 'proposal') {
      query = 'SELECT proposal_file, proposal_filename FROM partners WHERE id = ?';
      const [rows] = await pool.execute(query, [parseInt(id)]);
      const data = (rows as any[])[0];
      if (data && data.proposal_file) {
        fileName = data.proposal_filename || 'proposal';
        const base64Data = data.proposal_file;
        // Extract mime type from base64
        const mimeMatch = base64Data.match(/^data:([^;]+);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const base64Content = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        const buffer = Buffer.from(base64Content, 'base64');
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `inline; filename="${fileName}"`,
          },
        });
      }
    } else if (fileType === 'cv') {
      query = 'SELECT cv_file, cv_filename FROM partners WHERE id = ?';
      const [rows] = await pool.execute(query, [parseInt(id)]);
      const data = (rows as any[])[0];
      if (data && data.cv_file) {
        fileName = data.cv_filename || 'cv';
        const base64Data = data.cv_file;
        const mimeMatch = base64Data.match(/^data:([^;]+);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const base64Content = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        const buffer = Buffer.from(base64Content, 'base64');
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `inline; filename="${fileName}"`,
          },
        });
      }
    }

    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  } catch (error) {
    console.error('GET file error:', error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}

// PUT - Update partner status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID and status are required' 
      }, { status: 400 });
    }

    const validStatuses = ['pending', 'reviewed', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid status value' 
      }, { status: 400 });
    }

    await pool.execute(
      'UPDATE partners SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: `Partner ${status} successfully` 
    });

  } catch (error) {
    console.error('PUT partner error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update partner' 
    }, { status: 500 });
  }
}

// DELETE - Remove partner
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID is required' 
      }, { status: 400 });
    }

    await pool.execute('DELETE FROM partners WHERE id = ?', [parseInt(id)]);

    return NextResponse.json({ 
      success: true, 
      message: 'Partner deleted successfully' 
    });

  } catch (error) {
    console.error('DELETE partner error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete partner' 
    }, { status: 500 });
  }
}