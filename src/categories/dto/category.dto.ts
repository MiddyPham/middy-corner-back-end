import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Programming',
  })
  name: string;

  @ApiProperty({
    description: 'Category slug (auto-generated from name if not provided)',
    example: 'programming',
    required: false,
  })
  slug?: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Articles about programming and software development',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Category image URL',
    example: 'https://example.com/category-image.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Parent category ID for hierarchical structure',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  parentId?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 1,
    default: 0,
    required: false,
  })
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Programming',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Category slug',
    example: 'programming',
    required: false,
  })
  slug?: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Articles about programming and software development',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Category image URL',
    example: 'https://example.com/category-image.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Parent category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  parentId?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 1,
    required: false,
  })
  sortOrder?: number;

  @ApiProperty({
    description: 'Category active status',
    example: true,
    required: false,
  })
  isActive?: boolean;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Programming',
  })
  name: string;

  @ApiProperty({
    description: 'Category slug',
    example: 'programming',
  })
  slug: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Articles about programming and software development',
  })
  description: string;

  @ApiProperty({
    description: 'Category image URL',
    example: 'https://example.com/category-image.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Number of posts in this category',
    example: 15,
  })
  postCount: number;

  @ApiProperty({
    description: 'Category active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Sort order',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'Parent category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  parentId: string;

  @ApiProperty({
    description: 'Category creation date',
    example: '2024-01-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Category last update date',
    example: '2024-01-15T10:00:00Z',
  })
  updatedAt: Date;
}
