import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
    private prisma = new PrismaClient();

    async getCommentByTopicId(topicId: number) {
        return this.prisma.comment.findMany({
            where: { topicId: topicId},
            select: {
                text:true,
                media:true
            }
        })
    }

    async getAllCommentsFromAllTopicFromAllSubForum() {
        return this.prisma.comment.findMany({
            select: {
                text: true,
                media: true
            }
        })
    }

    async createCommentWithText(text: string, topicId: number) {
        return this.prisma.comment.create({
            data: {
                text: text,
                topic: {connect:{id:topicId}}
            },
        });
    }

    async createCommentWithTextAndMedia(topicId:number) {
        return this.prisma.comment.create({
            data: {
                topic:{connect:{id:topicId}}
            }
        })
    }


    async createCommentWithMedia(topicId:number) {
        return this.prisma.comment.create({
            data: {
                topic:{connect:{id:topicId}}
            }
        })
    }
}
