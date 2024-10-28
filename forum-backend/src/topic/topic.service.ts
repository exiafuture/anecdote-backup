import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TopicService {
    private prisma = new PrismaClient();

    async getTopicsBySubformId(subforumId: number) {
        return this.prisma.topic.findMany({
            where: {subforumId},
            select: {
                id: true,
                title: true,
                description: true,
                labels: true
            },
        });
    }

    async getTopicsAll() {
        return this.prisma.topic.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                labels: true
            },
        })
    }
}
