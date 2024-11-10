import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TopicService {
    private prisma = new PrismaClient();

    async isForThere(topicId:number,forfor:string):Promise<boolean>{
        const ex=await this.prisma.comment.findFirst({
            where:{
                topicId:topicId,
                forReplyId:{
                    equals:forfor
                }
            }
        });
        return !ex;
    }

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

    async createANewTopic(title:string,description:string,subforumId:number) {
        const existingTopic = await this.prisma.topic.findFirst({
            where: { title, subforumId },
        });
        if (existingTopic) {
            throw new ConflictException('Topic with this title already exists in this subforum');
        }
        return this.prisma.topic.create({
            data: {
                title,
                description,
                subforum:{connect:{id:subforumId}}
            }
        })
    }
}
