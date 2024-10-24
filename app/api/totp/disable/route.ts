import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { userId } = await request.json();

  try {
    // Fetch the user from the database
    const user = await prisma.creator.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if TOTP is already disabled
    if (!user.totpEnabled) {
      return NextResponse.json({ message: 'TOTP is already disabled' }, { status: 200 });
    }

    // Disable TOTP by removing the secret and marking totpEnabled as false
    await prisma.creator.update({
      where: { id: userId },
      data: {
        totpSecret: null,
        totpEnabled: false,
      },
    });

    return NextResponse.json({ message: 'TOTP disabled successfully' });
  } catch (error) {
    console.error('Error disabling TOTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
