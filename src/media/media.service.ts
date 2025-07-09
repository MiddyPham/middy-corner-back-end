import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Media, MediaType } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async create(file: any, createMediaDto: CreateMediaDto): Promise<Media> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { alt, description } = createMediaDto;

    // Cast file về đúng kiểu
    const multerFile = file as any;

    // Determine file type
    const fileType = this.getFileType(multerFile.mimetype as string);

    // Generate unique filename
    const filename = this.generateUniqueFilename(
      multerFile.originalname as string,
    );

    // Save file to uploads directory
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, multerFile.buffer);

    // Create media record
    const media = this.mediaRepository.create({
      filename,
      originalName: multerFile.originalname,
      mimeType: multerFile.mimetype,
      size: multerFile.size,
      url: `/uploads/${filename}`,
      alt: alt || multerFile.originalname,
      caption: description || multerFile.originalname,
      type: fileType,
    });

    return this.mediaRepository.save(media);
  }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
    } = {},
  ): Promise<{ data: Media[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, type } = options;

    const findOptions: FindManyOptions<Media> = {
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    };

    const whereConditions: any = {};

    if (search) {
      whereConditions.filename = Like(`%${search}%`);
    }

    if (type) {
      whereConditions.type = type;
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    const [data, total] = await this.mediaRepository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id: id.toString() },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const media = await this.findOne(id);

    Object.assign(media, updateMediaDto);

    return this.mediaRepository.save(media);
  }

  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);

    // Delete physical file
    const filePath = path.join(
      process.cwd(),
      'uploads',
      media.filename as string,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await this.mediaRepository.remove(media);
  }

  private getFileType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO;
    } else {
      return MediaType.DOCUMENT;
    }
  }

  private generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);

    return `${nameWithoutExt}_${timestamp}_${randomString}${extension}`;
  }

  async getMediaStats(): Promise<{
    total: number;
    byType: { [key: string]: number };
  }> {
    const total = await this.mediaRepository.count();

    const byType = await this.mediaRepository
      .createQueryBuilder('media')
      .select('media.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('media.type')
      .getRawMany();

    const typeStats = {};
    byType.forEach((item) => {
      typeStats[item?.type] = parseInt(item?.count as string);
    });

    return { total, byType: typeStats };
  }
}
