// app/api/admin/designs/[id]/approve/route.ts
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let connection;
  
  try {
    // 📌 REQUEST INFO LOG
    console.log('🚀 ========== NEW APPROVE REQUEST ==========');
    console.log('📅 Time:', new Date().toISOString());
    console.log('🔗 URL:', request.url);
    console.log('📝 Method:', request.method);
    
    // 📌 PARAMS LOG
    const { id } = await params;
    console.log('✅ Parsed params.id:', id);
    
    const designId = parseInt(id);
    console.log('🔢 Converted designId:', designId);
    
    if (isNaN(designId)) {
      console.log('❌ Invalid ID - NaN');
      return NextResponse.json(
        { success: false, error: 'Invalid design ID' },
        { status: 400 }
      );
    }
    
    connection = await pool.getConnection();
    console.log('📥 Database connection acquired');
    
    // 📌 CHECK IF DESIGN EXISTS AND GET DETAILS
    const [existingRows] = await connection.execute(
      `SELECT id, title, status, designer_id, revision_count, is_permanently_rejected, created_at 
       FROM designer_designs 
       WHERE id = ?`,
      [designId]
    ) as any[];
    
    console.log('📊 Database Check Result:');
    
    if (existingRows.length === 0) {
      console.log('❌ DESIGN NOT FOUND! ID:', designId);
      return NextResponse.json(
        { success: false, error: `Design with ID ${designId} not found` },
        { status: 404 }
      );
    }
    
    const design = existingRows[0];
    console.log('✅ Design found:');
    console.log('   - ID:', design.id);
    console.log('   - Title:', design.title);
    console.log('   - Current Status:', design.status);
    console.log('   - Revision Count:', design.revision_count);
    console.log('   - Is Permanently Rejected:', design.is_permanently_rejected);
    console.log('   - Designer ID:', design.designer_id);
    
    // 📌 CHECK IF PERMANENTLY REJECTED
    if (design.is_permanently_rejected === 1 || design.is_permanently_rejected === true) {
      console.log('❌ Cannot approve - Design is permanently rejected!');
      return NextResponse.json(
        { success: false, error: 'Cannot approve permanently rejected design. Maximum revisions (3) exceeded.' },
        { status: 400 }
      );
    }
    
    // 📌 CHECK IF ALREADY APPROVED
    if (design.status === 'approved') {
      console.log('⚠️ Design already approved!');
      return NextResponse.json({
        success: true,
        message: 'Design is already approved',
        data: {
          id: designId,
          status: 'approved'
        }
      });
    }
    
    // 📌 CHECK IF PENDING (can only approve pending designs)
    if (design.status !== 'pending') {
      console.log(`❌ Cannot approve design with status: ${design.status}`);
      return NextResponse.json(
        { success: false, error: `Cannot approve design with status: ${design.status}. Only pending designs can be approved.` },
        { status: 400 }
      );
    }
    
    // 📌 PERFORM UPDATE
    console.log('🔄 Updating design status to approved...');
    const [updateResult] = await connection.execute(
      `UPDATE designer_designs 
       SET status = 'approved', 
           approved_at = NOW(), 
           updated_at = NOW() 
       WHERE id = ? AND status = 'pending'`,
      [designId]
    ) as any[];
    
    console.log('📊 Update Result:', {
      affectedRows: updateResult.affectedRows,
      changedRows: updateResult.changedRows
    });
    
    if (updateResult.affectedRows === 0) {
      console.log('⚠️ No rows were updated!');
      return NextResponse.json(
        { success: false, error: 'Failed to approve design. Status may have changed.' },
        { status: 400 }
      );
    }
    
    // 📌 CREATE NOTIFICATION FOR DESIGNER
    console.log('📧 Sending notification to designer...');
    await connection.execute(
      `INSERT INTO designer_notifications 
       (designer_id, title, message, type, related_id, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        design.designer_id,
        'Design Approved 🎉',
        `Congratulations! Your design "${design.title}" has been approved. You can now upload white paper documentation.`,
        'design_approved',
        designId
      ]
    );
    
    console.log('✅ Notification sent successfully');
    
    // 📌 VERIFY THE UPDATE
    const [verifyRows] = await connection.execute(
      `SELECT id, status, approved_at, updated_at 
       FROM designer_designs 
       WHERE id = ?`,
      [designId]
    ) as any[];
    
    if (verifyRows.length > 0) {
      console.log('✅ Verification Result:');
      console.log('   - New Status:', verifyRows[0].status);
      console.log('   - Approved At:', verifyRows[0].approved_at);
    }
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ Total execution time: ${duration}ms`);
    console.log('🎉 ========== APPROVE SUCCESS ==========\n');
    
    return NextResponse.json({
      success: true,
      message: 'Design approved successfully',
      data: {
        id: designId,
        title: design.title,
        oldStatus: design.status,
        newStatus: 'approved',
        approved_at: verifyRows[0]?.approved_at
      }
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ ========== APPROVE ERROR ==========');
    console.error('⏱️ Time before error:', duration, 'ms');
    console.error('🚨 Error details:', error);
    
    if (error instanceof Error) {
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to approve design',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 Database connection released');
    }
  }
}