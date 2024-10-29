import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { comment } from '@prisma/client';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaClient){}

    async createCommentWithText(text: string, topicId: number): Promise<comment> {
        return this.prisma.comment.create({
            data: {
                text: text,
                topic: {connect:{id:topicId}}
            },
        });
    }

    async createCommentWithTextAndMedia(topicId:number): Promise<comment> {
        return this.prisma.comment.create({
            data: {
                topic:{connect:{id:topicId}}
            }
        })
    }


    async createCommentWithMedia(topicId:number): Promise<comment> {
        return this.prisma.comment.create({
            data: {
                topic:{connect:{id:topicId}}
            }
        })
    }
}
