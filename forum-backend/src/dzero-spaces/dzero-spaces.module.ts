import { Module } from '@nestjs/common';
import { DzeroSpacesService } from './dzero-spaces.service';
import { SpacesConfig } from './dzero-spaces.config';

@Module({
  providers: [DzeroSpacesService,SpacesConfig]
})
export class DzeroSpacesModule {}
