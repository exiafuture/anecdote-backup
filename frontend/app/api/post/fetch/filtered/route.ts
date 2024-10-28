// app/api/posts/filtered/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import Prisma client

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || undefined;
    const username = searchParams.get('username') || undefined;
    const afterDate = searchParams.get('after') ? new Date(searchParams.get('after')!) : undefined;
    const beforeDate = searchParams.get('before') ? new Date(searchParams.get('before')!) : undefined;

    try {
        // Create a filter object
        const filters: any = {
            AND: [],
        };

        if (name) {
            filters.AND.push({ title: { contains: name } });
        }
        if (username) {
            filters.AND.push({ author: {username: {contains: username }}});
        }
        if (afterDate) {
            filters.AND.push({ createdAt: { gte: afterDate } });
        }
        if (beforeDate) {
            filters.AND.push({ createdAt: { lte: beforeDate } });
        }

        const posts = await prisma.content.findMany({
            where: filters,
            select: {
                id: true,
                title: true,
                createdAt: true,
                tags: { select: { name: true } },
                medias: { select: { url: true } },
                author: { select: { username: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            createdAt: post.createdAt,
            tags: post.tags,
            image:
                post.medias.length > 0 ? 
                post.medias[0].url :
                'https://pbs.twimg.com/media/GarIQXEWIAAOkWs?format=jpg&name=medium',
        }));

        return NextResponse.json(formattedPosts);
    } catch (error) {
        console.error("Error fetching filtered posts:", error);
        return NextResponse.json({ message: "Error fetching filtered posts" }, { status: 500 });
    }
}
