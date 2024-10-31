import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { SubforumModule } from './subforum/subforum.module';
import { TopicModule } from './topic/topic.module';
import { DzeroSpacesModule } from './dzero-spaces/dzero-spaces.module';

@Module({
  imports: [
    CommentModule, 
    SubforumModule, 
    TopicModule, DzeroSpacesModule
  ],
  controllers: [
    AppController, 
  ],
  providers: [
    AppService, 
  ],
})
export class AppModule {}
