// app/api/post/fetch/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET({ params }: { params: { id: string | string[] } }) {
  const idString = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Convert the idString to a number
  const id = parseInt(idString, 10);

  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid content ID" }, { status: 400 });
  }

  try {
    const post = await prisma.content.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        createdAt: true,
        tags: { select: { name: true } },
        medias: { select: { url: true } },
        author: { select: { username: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Content post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ message: "Error fetching post" }, { status: 500 });
  }
}
