// app/api/auth/delete.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function DELETE(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let decoded: any;
  try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 }); // Forbidden
  }

  try {
    const user = await prisma.user.delete({
        where: { id: decoded.userId },
    });

    return NextResponse.json({ message: 'Account deleted', userId: user.id });
  } catch (error) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}