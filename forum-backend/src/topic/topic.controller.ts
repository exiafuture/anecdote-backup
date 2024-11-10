import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @Get()
    async findAllTopics() {
        return this.topicService.getTopicsAll();
    }

    @Get(":subforumId")
    async findAllTopicsInOneSubforum(@Param("subforumId") subforumId: string) {
        return this.topicService.getTopicsBySubformId(+subforumId);
    }

    @Get(":topicId/checkId")
    async findThere(
        @Param("topicId") topicId:string,
        @Query("forfor") forfor: string,
    ):Promise<{isValidthere: boolean}> {
        const pa = parseInt(topicId,10);
        if (isNaN(pa)) {
            throw new NotFoundException("invalid sub id");
        }
        const isOnor = await this.topicService.isForThere(pa,forfor);
        return {isValidthere:isOnor};
    }

    @Post()
    async createNewTopicForASubForum(
        @Body("title") title: string,
        @Body("description") description: string,
        @Body("subforumId") subforumId: number
    ) {
        return this.topicService.createANewTopic(title,description,subforumId);
    }
}
