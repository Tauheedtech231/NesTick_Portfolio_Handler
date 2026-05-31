// app/api/developer/check-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const assignmentId = searchParams.get('assignmentId');

    if (!assignmentId) {
      return NextResponse.json({ success: false, error: 'Assignment ID required' }, { status: 400 });
    }

    connection = await getConnection();

    // Check if template exists for this assignment
    const [templates] = await connection.execute(
      `SELECT id FROM templates WHERE assignment_id = ?`,
      [assignmentId]
    );

    const hasCode = (templates as any[]).length > 0;

    return NextResponse.json({
      success: true,
      hasCode: hasCode
    });

  } catch (error) {
    console.error('Check code error:', error);
    return NextResponse.json({ success: false, error: 'Failed to check code' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}