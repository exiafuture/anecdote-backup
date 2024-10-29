import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

    @Post()
    async createNewTopicForASubForum(
        @Body("title") title: string,
        @Body("description") description: string,
        @Body("subforumId") subforumId: number
    ) {
        return this.topicService.createANewTopic(title,description,subforumId);
    }
}
