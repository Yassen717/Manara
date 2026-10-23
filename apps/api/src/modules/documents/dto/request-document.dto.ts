import { IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestDocumentDto {
  @ApiProperty({ example: 'birth_certificate' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}
