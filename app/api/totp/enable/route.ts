// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
// import speakeasy from 'speakeasy';
// import QRCode from 'qrcode';

// export async function POST(req: Request) {
//   const { userId } = await req.json();

//   // Generate a new TOTP secret for the user
//   const secret = speakeasy.generateSecret({
//     name: 'YourAppName', // Name of your app that appears in the authenticator app
//   });

//   // Save the secret to the user's record in the database
//   await prisma.user.update({
//     where: { id: userId },
//     data: {
//       totpSecret: secret.base32,
//       totpEnabled: true, // Enable TOTP for this user
//     },
//   });

//   const otpauthUrl = speakeasy.otpauthURL({
//     secret: secret.base32,
//     label: `YourAppName:${userId}`,
//     issuer: 'YourAppName',
//     encoding: 'base32',
//   });

//   const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

//   return NextResponse.json({
//     message: 'TOTP enabled successfully',
//     qrCode: qrCodeDataUrl,
//   });
// }

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request: Request) {
  const { userId } = await request.json();

  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate a TOTP secret using speakeasy
    const secret = speakeasy.generateSecret({
      name: `MyApp (${user.email})`,
    });

    // Ensure that the otpauth_url is defined
    if (!secret.otpauth_url) {
      return NextResponse.json({ error: 'Error generating TOTP URL' }, { status: 500 });
    }

    // Store the secret in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        totpSecret: secret.base32,
        totpEnabled: true,
      },
    });

    // Generate a QR code for the otpauth_url
    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

    return NextResponse.json({
      qrCodeDataURL,
      otpauthURL: secret.otpauth_url, // Return the otpauth URL
    });
  } catch (error) {
    console.error('Error enabling TOTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

