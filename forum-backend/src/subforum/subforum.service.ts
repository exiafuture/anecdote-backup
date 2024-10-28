import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SubforumService {
    private prisma = new PrismaClient();

    async getAllSubForums() {
        return this.prisma.subforum.findMany({
            select: {
                id: true,
                name: true,
                description: true
            },
        });
    }
}
