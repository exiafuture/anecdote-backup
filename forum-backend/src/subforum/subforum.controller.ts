import { Controller, Get } from '@nestjs/common';
import { SubforumService } from './subforum.service';

@Controller('subforum')
export class SubforumController {
    constructor(private readonly subforumService: SubforumService) {}

    @Get()
    async findAll() {
        return this.subforumService.getAllSubForums();
    }
}
