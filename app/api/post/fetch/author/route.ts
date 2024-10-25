// /app/api/posts/by-creator/[username].ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  try {
    const posts = await prisma.content.findMany({
        where: {
          author: {
            username: username,
          },
        },
        select: {
          id: true,
          title: true,
          sold: true,
          content: true,
          medias: {
            select: {
              url: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          tags: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // Optional: Sort by creation date
        },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching posts by creator's username" },
      { status: 500 }
    );
  }
}
