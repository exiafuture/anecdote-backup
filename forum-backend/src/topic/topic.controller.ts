import { Controller, Get, Param } from '@nestjs/common';
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
}
