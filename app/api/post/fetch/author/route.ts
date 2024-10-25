// /app/api/posts/by-creator/[username].ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { URL } from 'url';

export async function GET(request: Request) {
  // Extract `username` from the query parameters of the request URL
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { message: "Username is required." },
      { status: 400 }
    );
  }

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
            tags: { select: { name: true } }, // Fetch associated tags
            medias: { select: { url: true } }, 
            createdAt: true,
        },
        orderBy: {
          createdAt: 'desc', // Optional: Sort by creation date
        },
    });
    const formattedPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        createdAt: post.createdAt,
        tags: post.tags, // Keep the tags as an array of objects
        image: post.medias.length > 0 ? post.medias[0].url : 'https://runnerstribe.com/wp-content/uploads/2024/08/femke-bol-with-team.jpg', // Get the first image or default image
    }));
    return NextResponse.json(formattedPosts);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching posts by creator's username" },
      { status: 500 }
    );
  }
}
