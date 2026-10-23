import { Module } from '@nestjs/common';
import { CitizensController } from './citizens.controller';
import { CitizensService } from './citizens.service';
import { ReferenceController } from './reference.controller';

@Module({
  controllers: [CitizensController, ReferenceController],
  providers: [CitizensService],
  exports: [CitizensService],
})
export class CitizensModule {}
