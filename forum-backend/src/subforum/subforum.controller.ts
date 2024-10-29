import { Controller, Get, Post, Body } from '@nestjs/common';
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
}
