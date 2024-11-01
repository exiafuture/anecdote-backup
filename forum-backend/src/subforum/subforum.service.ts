import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SubforumService {
    private prisma = new PrismaClient();

    async getAllSubForums() {
        return this.prisma.subforum.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
            },
        });
    }

    async createOneSubForum(name:string, description:string) {
        const existingSubforum = await this.prisma.subforum.findMany({
            where: {name:name}
        });
        if (existingSubforum.length>0) {
            throw new ConflictException('Subforum with this name already exists');
        }
        return this.prisma.subforum.create({
            data: {
                name:name,
                description:description,
                forum: {
                    connect: {id:1}
                }
            }
        })
    }
}
