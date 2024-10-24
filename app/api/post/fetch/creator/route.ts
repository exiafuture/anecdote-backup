// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import Prisma client
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(request: Request) {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    console.log(token);
    
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
        decoded = jwt.verify(token, SECRET);
    } catch (error) {
        return NextResponse.json({ message: "Invalid token" }, { status: 403 }); // Forbidden
    }
    
    const userId = decoded.userId;

    console.log(`user id in post fetch api: ${userId}`);

    try {
        // Fetch posts for the authenticated user
        const posts = await prisma.content.findMany({
            where: { 
                creatorId: userId
            }, // Fetch posts belonging to the user
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
