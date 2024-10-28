import { Module } from '@nestjs/common';
import { SubforumController } from './subforum.controller';
import { SubforumService } from './subforum.service';

@Module({
    controllers: [
        SubforumController
    ],
    providers: [
        SubforumService
    ]
})
export class SubforumModule {}
