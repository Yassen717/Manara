import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyServiceDto {
  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsObject()
  formData: Record<string, unknown>;
}
