import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! This is the nest js backend for anecdote | sayit-forum';
  }
}
