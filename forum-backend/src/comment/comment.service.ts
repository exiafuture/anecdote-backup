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
                media:true,
                forReplyId:true
            }
        })
    }

    async getCommentIntheSameSubForum(subforumId: number) {
        return this.prisma.comment.findMany({
            where: {
                topic: {
                    subforumId: subforumId
                }
            },
            select: {
                text:true,
                media:true,
                forReplyId:true
            }
        })
    }

    async getAllCommentsFromAllTopicFromAllSubForum() {
        return this.prisma.comment.findMany({
            select: {
                text: true,
                media: true,
                forReplyId:true
            }
        })
    }

    async createCommentWithText(text: string, topicId: number,forReply: string) {
        return this.prisma.comment.create({
            data: {
                text: text,
                topic: {connect:{id:topicId}},
                forReplyId:forReply
            },
        });
    }

    async createCommentWithTextAndMedia(topicId:number,forReply: string) {
        return this.prisma.comment.create({
            data: {
                topic:{connect:{id:topicId}},
                forReplyId:forReply
            }
        })
    }


    async createCommentWithMedia(topicId:number,forReply:string) {
        return this.prisma.comment.create({
            data: {
                topic:{connect:{id:topicId}},
                forReplyId:forReply
            }
        })
    }
}
