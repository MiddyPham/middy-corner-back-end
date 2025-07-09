import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'Tag name',
    example: 'NestJS',
  })
  name: string;

  @ApiProperty({
    description: 'Tag slug (auto-generated from name if not provided)',
    example: 'nestjs',
    required: false,
  })
  slug?: string;

  @ApiProperty({
    description: 'Tag description',
    example: 'Articles about NestJS framework',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Tag color (hex code)',
    example: '#ff6b6b',
    required: false,
  })
  color?: string;
}

export class UpdateTagDto {
  @ApiProperty({
    description: 'Tag name',
    example: 'NestJS',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Tag slug',
    example: 'nestjs',
    required: false,
  })
  slug?: string;

  @ApiProperty({
    description: 'Tag description',
    example: 'Articles about NestJS framework',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Tag color (hex code)',
    example: '#ff6b6b',
    required: false,
  })
  color?: string;

  @ApiProperty({
    description: 'Tag active status',
    example: true,
    required: false,
  })
  isActive?: boolean;
}

export class TagResponseDto {
  @ApiProperty({
    description: 'Tag unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Tag name',
    example: 'NestJS',
  })
  name: string;

  @ApiProperty({
    description: 'Tag slug',
    example: 'nestjs',
  })
  slug: string;

  @ApiProperty({
    description: 'Tag description',
    example: 'Articles about NestJS framework',
  })
  description: string;

  @ApiProperty({
    description: 'Tag color (hex code)',
    example: '#ff6b6b',
  })
  color: string;

  @ApiProperty({
    description: 'Number of posts with this tag',
    example: 8,
  })
  postCount: number;

  @ApiProperty({
    description: 'Tag active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Tag creation date',
    example: '2024-01-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Tag last update date',
    example: '2024-01-15T10:00:00Z',
  })
  updatedAt: Date;
}
