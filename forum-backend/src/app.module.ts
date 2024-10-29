import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { SubforumModule } from './subforum/subforum.module';
import { TopicModule } from './topic/topic.module';

@Module({
  imports: [
    CommentModule, SubforumModule, 
    TopicModule
  ],
  controllers: [
    AppController, 
  ],
  providers: [
    AppService, 
  ],
})
export class AppModule {}
