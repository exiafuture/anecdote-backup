import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import speakeasy from 'speakeasy';

export async function POST(request: Request) {
  const { userId, token } = await request.json();

  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if TOTP is enabled for the user
    if (!user.totpEnabled || !user.totpSecret) {
      return NextResponse.json({ error: 'TOTP is not enabled for this user' }, { status: 400 });
    }

    // Verify the TOTP token using speakeasy
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,  // The TOTP code from the request
      window: 1,  // Allow a small time drift (one previous or next time step)
    });

    if (!verified) {
      return NextResponse.json({ error: 'Invalid TOTP code' }, { status: 400 });
    }

    return NextResponse.json({ message: 'TOTP verified successfully' });
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
