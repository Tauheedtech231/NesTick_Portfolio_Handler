/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/assign-design/route.ts
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
    const { designId, developerId } = await request.json();

    if (!designId || !developerId) {
      return NextResponse.json(
        { success: false, error: 'Design ID and Developer ID are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Check if design exists and is approved
      const [designRows] = await connection.execute(
        'SELECT id, title, designer_id FROM designer_designs WHERE id = ? AND status = ?',
        [designId, 'approved']
      );

      if ((designRows as any[]).length === 0) {
        return NextResponse.json(
          { success: false, error: 'Design not found or not approved' },
          { status: 404 }
        );
      }

      // Check if developer exists and is approved
      const [developerRows] = await connection.execute(
        'SELECT id, name FROM developers WHERE id = ? AND status = ?',
        [developerId, 'approved']
      );

      if ((developerRows as any[]).length === 0) {
        return NextResponse.json(
          { success: false, error: 'Developer not found or not approved' },
          { status: 404 }
        );
      }

      // Check if already assigned
      const [existingAssignments] = await connection.execute(
        'SELECT id FROM developer_assignments WHERE design_id = ? AND status NOT IN ("completed", "rejected")',
        [designId]
      );

      if ((existingAssignments as any[]).length > 0) {
        return NextResponse.json(
          { success: false, error: 'This design is already assigned to another developer' },
          { status: 409 }
        );
      }

      // Create assignment
      const [result] = await connection.execute(
        `INSERT INTO developer_assignments 
         (design_id, developer_id, assigned_by, status, assigned_at)
         VALUES (?, ?, ?, 'pending', NOW())`,
        [designId, developerId, 1] // 1 = admin ID (you can get from session)
      );

      return NextResponse.json({
        success: true,
        message: 'Design assigned successfully',
        assignmentId: (result as any).insertId
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Assign design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign design' },
      { status: 500 }
    );
  }
}