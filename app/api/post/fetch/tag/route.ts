import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import Prisma client

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');

    if (!tag) {
        return NextResponse.json(  
            { message: "Tag parameter is required" },
            { status: 400 }
        );
    }

    try {
        const posts = await prisma.content.findMany({// Fetch posts belonging to the user
            where: {
                tags: {
                  some: { name: tag },
                },
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                tags: { select: { name: true } }, // Fetch associated tags
                medias: { select: { url: true } }  // Fetch associated images
            },
            orderBy: { createdAt: 'desc' }, // Optionally order posts by creation date
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
        console.error("Error fetching posts:", error);
        return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
    }
}
