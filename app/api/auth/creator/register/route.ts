// app/api/auth/register.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path according to your folder structure
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validatePassword } from '@/utils/validationPassword';

export async function POST(req: Request) {
  const { username, email, password, planId } = await req.json();

  // Check if user already exists
  const existingUserInCreator = await prisma.creator.findUnique({
    where: { username },
  });

  if (existingUserInCreator) {
    return NextResponse.json({ error: 'Username already exists in Creator' }, { status: 409 });
  }

  const existingUserInFinancer = await prisma.financer.findUnique({
    where: { username },
  });

  if (existingUserInFinancer) {
    return NextResponse.json({ error: 'Username already exists in Buyer' }, { status: 409 });
  }

  // Check if email already exists
  const existingEmailInCreator = await prisma.creator.findUnique({
    where: { email },
  });

  if (existingEmailInCreator) {
    return NextResponse.json({ error: 'Email already exists in Creator' }, { status: 409 });
  }

  const existingEmailInFinancer = await prisma.financer.findUnique({
    where: { email },
  });

  if (existingEmailInFinancer) {
    return NextResponse.json({ error: 'Email already exists in Buyer' }, { status: 409 });
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
    const newSubscription = await prisma.subscription.create({
      data: {
        status: 'active',
        paymentMethod: 'stripe', // You can customize this value if needed
        planChosen: { connect: { id: planId } }, // Associate with the plan
      },
    });

    // Create a new creator
    const newCreator = await prisma.creator.create({
      data: {
        username,
        email,
        password: hashedPassword,
        subscriptionId: newSubscription.id, // Link subscriptionId to the creator
      },
    });

    // Update the subscription with creatorId after the creator is created
    await prisma.subscription.update({
      where: { id: newSubscription.id },
      data: {
        creatorId: newCreator.id,  // Link the subscription to the newly created creator
      },
    });

    const token = jwt.sign(
      { userId: newCreator.id, username: newCreator.username, email: newCreator.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '168h' }
    );

    // Return the created user (or any other response you prefer)
    return NextResponse.json({ message: 'User registered successfully', 
      token,
      userId: newCreator.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
}
