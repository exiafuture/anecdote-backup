import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import Prisma client

export async function GET() {
    try {
        const tags = await prisma.label.findMany({
            where: {
                content: { some: {} } 
            },
            select: {
                id: true,
                name: true,
            }, 
        });

        return NextResponse.json(tags);
    } catch (error) {
        console.error("Error fetching all unique tag:", error);
        return NextResponse.json({ message: "Error fetching tags" }, { status: 500 });
    }
}
