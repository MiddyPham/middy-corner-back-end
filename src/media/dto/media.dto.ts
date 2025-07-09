import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../entities/media.entity';

export class UploadMediaDto {
  @ApiProperty({
    description: 'File to upload',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Alt text for the media',
    example: 'NestJS logo',
    required: false,
  })
  alt?: string;

  @ApiProperty({
    description: 'Caption for the media',
    example: 'Official NestJS framework logo',
    required: false,
  })
  caption?: string;
}

export class MediaResponseDto {
  @ApiProperty({
    description: 'Media unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'File name',
    example: 'nestjs-logo.png',
  })
  filename: string;

  @ApiProperty({
    description: 'Original file name',
    example: 'nestjs-logo.png',
  })
  originalName: string;

  @ApiProperty({
    description: 'MIME type',
    example: 'image/png',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  size: number;

  @ApiProperty({
    description: 'File path on server',
    example: '/uploads/images/nestjs-logo.png',
  })
  path: string;

  @ApiProperty({
    description: 'Public URL',
    example: 'https://example.com/uploads/images/nestjs-logo.png',
  })
  url: string;

  @ApiProperty({
    description: 'Media type',
    enum: MediaType,
    example: MediaType.IMAGE,
  })
  type: MediaType;

  @ApiProperty({
    description: 'Alt text',
    example: 'NestJS logo',
  })
  alt: string;

  @ApiProperty({
    description: 'Caption',
    example: 'Official NestJS framework logo',
  })
  caption: string;

  @ApiProperty({
    description: 'Image width (for images only)',
    example: 800,
  })
  width: number;

  @ApiProperty({
    description: 'Image height (for images only)',
    example: 600,
  })
  height: number;

  @ApiProperty({
    description: 'Media active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Uploader information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'john@example.com',
    },
  })
  uploader: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({
    description: 'Upload date',
    example: '2024-01-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:00:00Z',
  })
  updatedAt: Date;
}

export class MediaFilterDto {
  @ApiProperty({
    description: 'Filter by media type',
    enum: MediaType,
    required: false,
  })
  type?: MediaType;

  @ApiProperty({
    description: 'Search by filename or original name',
    example: 'logo',
    required: false,
  })
  search?: string;

  @ApiProperty({
    description: 'Filter by uploader ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  uploaderId?: string;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    default: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 20,
    default: 20,
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
