import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { verify } from "@/lib/auth";
import { logError, logInfo } from '@/lib/errorLogging';

const familyMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  additionalInfo: z.string().optional(),
  profilePicture: z.string().optional(),
  permissions: z.object({
    viewDocuments: z.boolean(),
    viewContacts: z.boolean(),
    viewProfile: z.boolean()
  })
});

export async function POST(request: NextRequest) {
  console.log('POST /api/family-members: Received request');
  try {
    logInfo('Received POST request to /api/family-members');

    const token = request.cookies.get('token')?.value;
    console.log('Token:', token ? 'Present' : 'Not present');
    if (!token) {
      logError('No token provided', 'POST /api/family-members');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: string;
    try {
      const payload = await verify(token);
      userId = payload.userId;
      logInfo(`Verified token for user: ${userId}`);
    } catch (error) {
      logError(error, 'Token verification error in POST /api/family-members');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    logInfo('Received body:', body);

    try {
      const validatedData = familyMemberSchema.parse(body);
      logInfo('Validated data:', validatedData);

      const client = await pool.connect();
      try {
        const result = await client.query(
          `INSERT INTO family_members 
          (user_id, name, relationship, email, phone, address, additional_info, profile_picture, permissions) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
          RETURNING id`,
          [
            userId,
            validatedData.name,
            validatedData.relationship,
            validatedData.email,
            validatedData.phone,
            validatedData.address,
            validatedData.additionalInfo,
            validatedData.profilePicture,
            JSON.stringify(validatedData.permissions)
          ]
        );

        const newFamilyMember = { id: result.rows[0].id, ...validatedData };
        logInfo('New family member created:', newFamilyMember);
        return NextResponse.json(newFamilyMember, { status: 201 });
      } finally {
        client.release();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        logError(error, 'Validation error in POST /api/family-members');
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    logError(error, 'POST /api/family-members');
    return NextResponse.json({ error: 'Failed to create family member' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: string;
    try {
      const payload = await verify(token);
      userId = payload.userId;
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM family_members WHERE user_id = $1',
        [userId]
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    logError(error, 'GET /api/family-members');
    return NextResponse.json({ error: 'Failed to retrieve family members' }, { status: 500 });
  }
}

