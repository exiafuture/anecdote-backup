import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubforumController } from './subforum/subforum.controller';
import { TopicController } from './topic/topic.controller';
import { SubforumService } from './subforum/subforum.service';
import { TopicService } from './topic/topic.service';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { LabelController } from './label/label.controller';
import { IllustrationController } from './illustration/illustration.controller';
import { LabelService } from './label/label.service';
import { IllustrationService } from './illustration/illustration.service';
import { CommentModule } from './comment/comment.module';
import { IllustrationModule } from './illustration/illustration.module';
import { LabelModule } from './label/label.module';
import { SubforumModule } from './subforum/subforum.module';
import { TopicModule } from './topic/topic.module';

@Module({
  imports: [
    CommentModule, IllustrationModule, 
    LabelModule, SubforumModule, 
    TopicModule
  ],
  controllers: [
    AppController, SubforumController, 
    TopicController, CommentController, 
    LabelController, IllustrationController
  ],
  providers: [
    AppService, SubforumService, 
    TopicService, CommentService, 
    LabelService, IllustrationService
  ],
})
export class AppModule {}
