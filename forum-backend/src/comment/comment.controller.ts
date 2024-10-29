import { Controller, Post, Param, Get, Body } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get(":topicId")
    async findAllCommentsInTopic(@Param("topicId") topicId:string) {
        return this.commentService.getCommentByTopicId(+topicId);
    }

    @Get()
    async findAllComments() {
        return this.commentService.getAllCommentsFromAllTopicFromAllSubForum();
    }

    @Post()
    async createACommentWithTextInOneTopic(
        @Body("text") text:string,
        @Body("topicId") topicId: number
    ) {
        return this.commentService.createCommentWithText(text,topicId);
    }
}
