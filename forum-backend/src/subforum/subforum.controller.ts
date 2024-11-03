import { 
    Controller, Get, Post, Query, 
    Body, ConflictException, 
    Param, NotFoundException 
} from '@nestjs/common';
import { SubforumService } from './subforum.service';

@Controller('subforum')
export class SubforumController {
    constructor(private readonly subforumService: SubforumService) {}

    @Get()
    async findAll() {
        return this.subforumService.getAllSubForums();
    }

    @Get(":id/filter")
    async oneSubByIdAndByFilter(
        @Param("id") id:string,
        @Query('labels') labels: string[],
        @Query('title') title: string,
    ) {
        const pa = parseInt(id,10);
        if (isNaN(pa)) {
            throw new NotFoundException("invalid sub id");
        }
        return this.subforumService.getFilterSubforumAllRelated(
            pa,labels,title
        )
    }

    @Get(":id")
    async justOneSubforumById(@Param("id") id:string) {
        const pa = parseInt(id,10);
        if (isNaN(pa)) {
            throw new NotFoundException("invalid sub id");
        }
        return this.subforumService.getSubForumByItsId(pa);
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
        if (parsedDate && isNaN(parsedDate.getTime())) {
            throw new ConflictException('Invalid date format');
        }
        return this.subforumService.getAllSubForumsThatFitFilter(name, parsedDate);
    }
}
