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
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const partnerType = searchParams.get('partnerType');

    let query = `SELECT id, partner_id, partner_type, other_domain, organization_name, contact_person, 
                        email, phone, country, message, links, proposal_filename, proposal_file, 
                        cv_filename, cv_file, status, created_at, experience, region, company_name,
                        linkedin_url, agency_name, services, team_size, website_url, sales_target
                        FROM partners WHERE 1=1`;
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
    
    const processedRows = (rows as any[]).map(row => ({
      ...row,
      proposal_url: row.proposal_file ? `/api/partners/file?id=${row.id}&type=proposal` : null,
      cv_url: row.cv_file ? `/api/partners/file?id=${row.id}&type=cv` : null,
      proposal_file: undefined,
      cv_file: undefined
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

// POST - Create new partner (supports 3 types: business_dev, marketing_agency, sales)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      id,
      partnerType,
      // Common fields
      name,
      email,
      phone,
      message,
      // Partner form fields
      otherDomain,
      organizationName,
      contactPerson,
      country,
      links,
      proposalFile,
      proposalFileName,
      cvFile,
      cvFileName,
      // Business Dev fields
      company,
      experience,
      region,
      linkedin,
      // Marketing Agency fields
      agencyName,
      contactPerson: marketingContact,
      website,
      services,
      teamSize,
      // Sales fields
      salesTarget,
    } = body;

    // Validation based on partner type
    if (!partnerType) {
      return NextResponse.json({ 
        success: false, 
        error: 'Partner type is required' 
      }, { status: 400 });
    }

    let finalOrgName = '';
    let finalContactPerson = '';
    let finalMessage = message || '';
    let finalExperience = null;
    let finalRegion = null;
    let finalCompanyName = null;
    let finalLinkedinUrl = null;
    let finalAgencyName = null;
    let finalServices = null;
    let finalTeamSize = null;
    let finalWebsiteUrl = null;
    let finalSalesTarget = null;

    // Validate based on partner type
    switch(partnerType) {
      case 'business_dev':
        if (!name || !email || !company || !experience || !region) {
          return NextResponse.json({ 
            success: false, 
            error: 'Name, email, company, experience and region are required for Business Developer' 
          }, { status: 400 });
        }
        finalOrgName = company;
        finalContactPerson = name;
        finalCompanyName = company;
        finalExperience = experience;
        finalRegion = region;
        finalLinkedinUrl = linkedin || null;
        finalMessage = `Business Developer Application\n\nName: ${name}\nCompany: ${company}\nExperience: ${experience}\nRegion: ${region}\nLinkedIn: ${linkedin || 'N/A'}\n\nMessage: ${message || ''}`;
        break;

      case 'marketing_agency':
        if (!agencyName || !marketingContact || !email || !phone || !services || !teamSize) {
          return NextResponse.json({ 
            success: false, 
            error: 'Agency name, contact person, email, phone, services and team size are required for Marketing Agency' 
          }, { status: 400 });
        }
        finalOrgName = agencyName;
        finalContactPerson = marketingContact;
        finalAgencyName = agencyName;
        finalServices = services;
        finalTeamSize = teamSize;
        finalWebsiteUrl = website || null;
        finalMessage = `Marketing Agency Registration\n\nAgency: ${agencyName}\nContact: ${marketingContact}\nServices: ${services}\nTeam Size: ${teamSize}\nWebsite: ${website || 'N/A'}\n\nMessage: ${message || ''}`;
        break;

      case 'sales':
        if (!name || !email || !company || !experience || !region || !salesTarget) {
          return NextResponse.json({ 
            success: false, 
            error: 'Name, email, company, experience, region and sales target are required for Sales Person' 
          }, { status: 400 });
        }
        finalOrgName = company;
        finalContactPerson = name;
        finalCompanyName = company;
        finalExperience = experience;
        finalRegion = region;
        finalSalesTarget = salesTarget;
        finalMessage = `Sales Person Application\n\nName: ${name}\nCompany: ${company}\nExperience: ${experience}\nRegion: ${region}\nSales Target: $${salesTarget}+\n\nMessage: ${message || ''}`;
        break;

      default:
        // Original partner form
        if (!organizationName || !contactPerson || !email) {
          return NextResponse.json({ 
            success: false, 
            error: 'Organization name, contact person and email are required' 
          }, { status: 400 });
        }
        finalOrgName = organizationName;
        finalContactPerson = contactPerson;
    }

    // ✅ FIX: Check if email exists with SAME partner_type only
    const [existing] = await pool.execute(
      'SELECT id, partner_type FROM partners WHERE email = ?', 
      [email]
    );

    if ((existing as any[]).length > 0) {
      const existingRecord = (existing as any[])[0];
      // Only block if same email AND same partner_type
      if (existingRecord.partner_type === partnerType) {
        return NextResponse.json({ 
          success: false, 
          error: `Email already registered as ${partnerType}. Please use different email.` 
        }, { status: 409 });
      }
      // Different partner_type - allow it (no error)
      console.log(`✅ Email ${email} already exists as ${existingRecord.partner_type}, allowing as ${partnerType}`);
    }

    // Store files
    let proposalData = null;
    let cvData = null;

    if (proposalFile && proposalFileName) {
      proposalData = proposalFile;
    }

    if (cvFile && cvFileName) {
      cvData = cvFile;
    }

    // Prepare links JSON
    let linksJSON = links || null;
    if (partnerType === 'business_dev' && linkedin) {
      linksJSON = JSON.stringify([linkedin]);
    }

    // Insert partner with all fields
    const [result] = await pool.execute(
      `INSERT INTO partners (
        partner_id, partner_type, other_domain, organization_name, contact_person, 
        email, phone, country, message, links, proposal_filename, proposal_file, 
        cv_filename, cv_file, status, experience, region, company_name,
        linkedin_url, agency_name, services, team_size, website_url, sales_target
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id || `PART-${Date.now()}`,
        partnerType,
        otherDomain || null,
        finalOrgName,
        finalContactPerson,
        email,
        phone || null,
        country || null,
        finalMessage || null,
        linksJSON,
        proposalFileName || null,
        proposalData,
        cvFileName || null,
        cvData,
        finalExperience,
        finalRegion,
        finalCompanyName,
        finalLinkedinUrl,
        finalAgencyName,
        finalServices,
        finalTeamSize,
        finalWebsiteUrl,
        finalSalesTarget
      ]
    );

    const insertId = (result as any).insertId;

    // Get inserted record
    const [newPartner] = await pool.execute(
      `SELECT id, partner_id, partner_type, other_domain, organization_name, contact_person, 
              email, phone, country, message, links, proposal_filename, cv_filename, 
              status, created_at, experience, region, company_name, linkedin_url,
              agency_name, services, team_size, website_url, sales_target
              FROM partners WHERE id = ?`,
      [insertId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully. Waiting for review.',
      data: (newPartner as any[])[0]
    }, { status: 201 });

  } catch (error) {
    console.error('POST partner error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit application' 
    }, { status: 500 });
  }
}

// GET file endpoint - to retrieve file from database
export async function GET_FILE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const fileType = searchParams.get('type');

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