import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType } from '../entities/post.entity';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Post slug (auto-generated from title if not provided)',
    example: 'getting-started-with-nestjs',
    required: false,
  })
  slug?: string;

  @ApiProperty({
    description: 'Post content (rich text or markdown)',
    example: 'This is a comprehensive guide to getting started with NestJS...',
  })
  content: string;

  @ApiProperty({
    description: 'Post excerpt (short description)',
    example: 'Learn how to build scalable applications with NestJS',
    required: false,
  })
  excerpt?: string;

  @ApiProperty({
    description: 'Post thumbnail image URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.DRAFT,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.ARTICLE,
    default: PostType.ARTICLE,
  })
  type: PostType;

  @ApiProperty({
    description: 'Category IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
  })
  categoryIds?: string[];

  @ApiProperty({
    description: 'Tag IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
  })
  tagIds?: string[];

  // SEO fields
  @ApiProperty({
    description: 'SEO title',
    example: 'NestJS Tutorial - Complete Guide',
    required: false,
  })
  seoTitle?: string;

  @ApiProperty({
    description: 'SEO description',
    example: 'Learn NestJS from scratch with this comprehensive tutorial',
    required: false,
  })
  seoDescription?: string;

  @ApiProperty({
    description: 'SEO keywords',
    example: 'nestjs, tutorial, typescript, backend',
    required: false,
  })
  seoKeywords?: string;

  // Scheduled publishing
  @ApiProperty({
    description: 'Scheduled publish date',
    example: '2024-01-15T10:00:00Z',
    required: false,
  })
  scheduledAt?: Date;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Post slug',
    example: 'getting-started-with-nestjs',
    required: false,
  })
  slug?: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is a comprehensive guide to getting started with NestJS...',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: 'Post excerpt',
    example: 'Learn how to build scalable applications with NestJS',
    required: false,
  })
  excerpt?: string;

  @ApiProperty({
    description: 'Post thumbnail image URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
    required: false,
  })
  status?: PostStatus;

  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.ARTICLE,
    required: false,
  })
  type?: PostType;

  @ApiProperty({
    description: 'Category IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
  })
  categoryIds?: string[];

  @ApiProperty({
    description: 'Tag IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
  })
  tagIds?: string[];

  // SEO fields
  @ApiProperty({
    description: 'SEO title',
    example: 'NestJS Tutorial - Complete Guide',
    required: false,
  })
  seoTitle?: string;

  @ApiProperty({
    description: 'SEO description',
    example: 'Learn NestJS from scratch with this comprehensive tutorial',
    required: false,
  })
  seoDescription?: string;

  @ApiProperty({
    description: 'SEO keywords',
    example: 'nestjs, tutorial, typescript, backend',
    required: false,
  })
  seoKeywords?: string;

  // Scheduled publishing
  @ApiProperty({
    description: 'Scheduled publish date',
    example: '2024-01-15T10:00:00Z',
    required: false,
  })
  scheduledAt?: Date;
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
    description: 'Post slug',
    example: 'getting-started-with-nestjs',
  })
  slug: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is a comprehensive guide to getting started with NestJS...',
  })
  content: string;

  @ApiProperty({
    description: 'Post excerpt',
    example: 'Learn how to build scalable applications with NestJS',
  })
  excerpt: string;

  @ApiProperty({
    description: 'Post thumbnail image URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnail: string;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
  })
  status: PostStatus;

  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.ARTICLE,
  })
  type: PostType;

  @ApiProperty({
    description: 'Number of views',
    example: 150,
  })
  viewCount: number;

  @ApiProperty({
    description: 'Number of likes',
    example: 25,
  })
  likeCount: number;

  @ApiProperty({
    description: 'Number of comments',
    example: 10,
  })
  commentCount: number;

  @ApiProperty({
    description: 'SEO title',
    example: 'NestJS Tutorial - Complete Guide',
  })
  seoTitle: string;

  @ApiProperty({
    description: 'SEO description',
    example: 'Learn NestJS from scratch with this comprehensive tutorial',
  })
  seoDescription: string;

  @ApiProperty({
    description: 'SEO keywords',
    example: 'nestjs, tutorial, typescript, backend',
  })
  seoKeywords: string;

  @ApiProperty({
    description: 'Published date',
    example: '2024-01-15T10:00:00Z',
  })
  publishedAt: Date;

  @ApiProperty({
    description: 'Scheduled date',
    example: '2024-01-15T10:00:00Z',
  })
  scheduledAt: Date;

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
    description: 'Post categories',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Programming',
        slug: 'programming',
      },
    ],
  })
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  @ApiProperty({
    description: 'Post tags',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'NestJS',
        slug: 'nestjs',
      },
    ],
  })
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  @ApiProperty({
    description: 'Post creation date',
    example: '2024-01-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Post last update date',
    example: '2024-01-15T10:00:00Z',
  })
  updatedAt: Date;
}

export class PostFilterDto {
  @ApiProperty({
    description: 'Filter by status',
    enum: PostStatus,
    required: false,
  })
  status?: PostStatus;

  @ApiProperty({
    description: 'Filter by category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    description: 'Filter by tag ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  tagId?: string;

  @ApiProperty({
    description: 'Filter by author ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  authorId?: string;

  @ApiProperty({
    description: 'Search by title or content',
    example: 'nestjs',
    required: false,
  })
  search?: string;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    default: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    default: 10,
    required: false,
  })
  limit?: number;

  @ApiProperty({
    description: 'Sort by field',
    example: 'createdAt',
    default: 'createdAt',
    required: false,
  })
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 'DESC',
    default: 'DESC',
    required: false,
  })
  sortOrder?: 'ASC' | 'DESC';
}

// DTO mới cho dữ liệu từ frontend
export class CreateBlogPostDto {
  @ApiProperty({
    description: 'Blog title',
    example: 'Getting Started with NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Blog slug',
    example: 'getting-started-with-nestjs',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Blog description',
    example: 'Learn how to build scalable applications with NestJS',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Blog content (HTML/rich text)',
    example: '<p>This is the main content...</p>',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Blog thumbnail',
    example: {},
    required: false,
  })
  @IsOptional()
  thumbnail?: any;

  @ApiProperty({
    description: 'Blog category',
    example: 'design',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Blog status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
  })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty({
    description: 'SEO title',
    example: 'NestJS Tutorial - Complete Guide',
    required: false,
  })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiProperty({
    description: 'SEO description',
    example: 'Learn NestJS from scratch',
    required: false,
  })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiProperty({
    description: 'SEO keywords',
    example: 'nestjs, tutorial, typescript',
    required: false,
  })
  @IsString()
  @IsOptional()
  seoKeywords?: string;

  @ApiProperty({
    description: 'Publish date',
    example: '2025-07-08T18:19:15.945Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  publishDate?: string;

  @ApiProperty({
    description: 'Blog tags',
    example: [],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
