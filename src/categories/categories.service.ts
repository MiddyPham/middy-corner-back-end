import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { generateSlug } from '../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, description, status = 'active' } = createCategoryDto;

    const slug = generateSlug(name);

    const category = this.categoriesRepository.create({
      name,
      slug,
      description,
      status,
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    } = {},
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, status } = options;

    const findOptions: FindManyOptions<Category> = {
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['posts'],
    };

    const whereConditions: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }

    if (status) {
      whereConditions.status = status;
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    const [data, total] =
      await this.categoriesRepository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id: id.toString() },
      relations: ['posts'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['posts'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async findPostsByCategory(
    id: number,
    options: { page?: number; limit?: number } = {},
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = options;

    const category = await this.categoriesRepository.findOne({
      where: { id: id.toString() },
      relations: ['posts'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Get posts with pagination
    const posts = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.posts', 'post')
      .where('category.id = :id', { id })
      .andWhere('post.status = :status', { status: 'published' })
      .orderBy('post.publishedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getOne();

    const total = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('category.posts', 'post')
      .where('category.id = :id', { id })
      .andWhere('post.status = :status', { status: 'published' })
      .getCount();

    return {
      data: posts?.posts || [],
      total,
      page,
      limit,
    };
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    const { name, description, status } = updateCategoryDto;

    if (name && name !== category.name) {
      category.slug = generateSlug(name);
    }

    Object.assign(category, {
      name: name || category.name,
      description:
        description !== undefined ? description : category.description,
      status: status || category.status,
    });

    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  async getActiveCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { status: 'active' },
      order: { name: 'ASC' },
    });
  }
}
