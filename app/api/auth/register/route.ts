// app/api/auth/register.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path according to your folder structure
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validatePassword } from '@/utils/validationPassword';

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
  }

  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  }

  if (!validatePassword(password)) {
    return NextResponse.json(
      { error: 'Password must have at least 7 characters, one uppercase and one lowercase letter' }, 
      { status: 400 }
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create a new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '168h' }
    );

    // Return the created user (or any other response you prefer)
    return NextResponse.json({ message: 'User registered successfully', token,userId: user.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
}
