import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is a comprehensive guide to getting started with NestJS...',
  })
  content: string;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is a comprehensive guide to getting started with NestJS...',
    required: false,
  })
  content?: string;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'Post unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is a comprehensive guide to getting started with NestJS...',
  })
  content: string;

  @ApiProperty({
    description: 'Number of views',
    example: 150,
  })
  viewCount: number;

  @ApiProperty({
    description: 'Post author information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'john@example.com',
    },
  })
  author: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({
    description: 'Post creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Post last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
} 