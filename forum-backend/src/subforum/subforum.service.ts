import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { title } from 'process';

@Injectable()
export class SubforumService {
    private prisma = new PrismaClient();

    async getFilterSubforumAllRelated(id:number, labels: string[], topicName?: string) {
        const filtered = await this.prisma.subforum.findUnique({
            where: {id:id},
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                topics: {
                    where: {
                        AND: [
                            title ? {title:{contains:topicName}}:{},
                            labels ? {labels:{some:{name:{in:labels}}}}:{}
                        ],
                    },
                    select: {
                        id: true,
                        title: true,
                        createdAt: true,
                        description: true,
                        labels: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        })

        return filtered;
    }

    async getSubForumByItsId(id:number) {
        const thatSubForum = await this.prisma.subforum.findUnique({
            where: {id},
            select: {
                id:true,
                name:true,
                description:true,
                createdAt:true,
                topics: {
                    select:{
                        id:true,
                        title:true,
                        createdAt:true,
                        description:true,
                        labels: true,
                    },
                    orderBy: {createdAt:"desc"}
                }
            },
        })

        if (!thatSubForum) {
            throw new NotFoundException("no such subforum");
        }
        return thatSubForum;
    }

    async getAllSubForums() {
        return this.prisma.subforum.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getAllSubForumsThatFitFilter(
        name?: string,
        createdAt?: Date
    ) {
        return this.prisma.subforum.findMany({
            where: {
                AND: [
                    name ? {name:{contains:name}}:{},
                    createdAt ? {createdAt: { gte: createdAt }}:{}
                ]
            },
            select: {
                id:true,
                name:true,
                description:true,
                createdAt:true
            },
            orderBy:{createdAt:"desc"}
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
