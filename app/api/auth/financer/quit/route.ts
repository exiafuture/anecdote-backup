import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function DELETE(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 }); // Forbidden
  }
  const userId = decoded.userId;

  try {
    await prisma.financer.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User account deleted successfully.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 400 });
  }
}