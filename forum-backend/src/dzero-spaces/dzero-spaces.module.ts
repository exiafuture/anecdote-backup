import { Module } from '@nestjs/common';
import { DzeroSpacesService } from './dzero-spaces.service';

@Module({
  providers: [DzeroSpacesService]
})
export class DzeroSpacesModule {}
