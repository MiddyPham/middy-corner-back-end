import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { generateSlug } from '../common/utils/slug.util';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { name, description } = createTagDto;

    const slug = generateSlug(name);

    const tag = this.tagsRepository.create({
      name,
      slug,
      description,
    });

    return this.tagsRepository.save(tag);
  }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
    } = {},
  ): Promise<{ data: Tag[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search } = options;

    const findOptions: FindManyOptions<Tag> = {
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
      relations: ['posts'],
    };

    if (search) {
      findOptions.where = {
        name: Like(`%${search}%`),
      };
    }

    const [data, total] = await this.tagsRepository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: { id: id.toString() },
      relations: ['posts'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async findBySlug(slug: string): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: { slug },
      relations: ['posts'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug ${slug} not found`);
    }

    return tag;
  }

  async findPostsByTag(
    id: number,
    options: { page?: number; limit?: number } = {},
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = options;

    const tag = await this.tagsRepository.findOne({
      where: { id: id.toString() },
      relations: ['posts'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    // Get posts with pagination
    const posts = await this.tagsRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.posts', 'post')
      .where('tag.id = :id', { id })
      .andWhere('post.status = :status', { status: 'published' })
      .orderBy('post.publishedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getOne();

    const total = await this.tagsRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.posts', 'post')
      .where('tag.id = :id', { id })
      .andWhere('post.status = :status', { status: 'published' })
      .getCount();

    return {
      data: posts?.posts || [],
      total,
      page,
      limit,
    };
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    const { name, description } = updateTagDto;

    if (name && name !== tag.name) {
      tag.slug = generateSlug(name);
    }

    Object.assign(tag, {
      name: name || tag.name,
      description: description !== undefined ? description : tag.description,
    });

    return this.tagsRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagsRepository.remove(tag);
  }

  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    return this.tagsRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.posts', 'post')
      .addSelect('COUNT(post.id)', 'postCount')
      .where('post.status = :status', { status: 'published' })
      .groupBy('tag.id')
      .orderBy('postCount', 'DESC')
      .limit(limit)
      .getMany();
  }
}
