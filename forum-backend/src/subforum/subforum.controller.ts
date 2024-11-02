import { Controller, Get, Post, Query, Body, ConflictException } from '@nestjs/common';
import { SubforumService } from './subforum.service';

@Controller('subforum')
export class SubforumController {
    constructor(private readonly subforumService: SubforumService) {}

    @Get()
    async findAll() {
        return this.subforumService.getAllSubForums();
    }

    @Post()
    async createOneNewSubForum(
        @Body("name") name: string, 
        @Body("description") description: string
    ) {
        return this.subforumService.createOneSubForum(name,description)
    }

    @Get("filter")
    async findSlect(
        @Query('name') name?: string,
        @Query('createdAt') createdAt?: string,
    ) {
        const parsedDate = createdAt ? new Date(createdAt) : undefined;
        return this.subforumService.getAllSubForumsThatFitFilter(name, parsedDate);
    }
}
