import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({
    description: 'Alternative text for the media file',
    example: 'A beautiful landscape image',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  alt?: string;

  @ApiProperty({
    description: 'Description of the media file',
    example: 'This is a high-quality landscape photograph',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
} 