import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';
import { Post, PostStatus, PostType } from './entities/post.entity';
import {
  CreatePostDto,
  UpdatePostDto,
  PostFilterDto,
  CreateBlogPostDto,
} from './dto/post.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { generateSlug, generateUniqueSlug } from '../common/utils/slug.util';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    // Generate slug if not provided
    let slug = createPostDto.slug;
    if (!slug) {
      slug = generateSlug(createPostDto.title);
    }

    // Check if slug already exists
    const existingSlugs = await this.postsRepository
      .createQueryBuilder('post')
      .select('post.slug')
      .getRawMany();

    const slugs = existingSlugs.map((item) => item.post_slug);
    slug = generateUniqueSlug(slug, slugs);

    // Handle categories and tags
    let categories: Category[] = [];
    let tags: Tag[] = [];

    if (createPostDto.categoryIds?.length) {
      categories = await this.categoryRepository.find({
        where: { id: In(createPostDto.categoryIds) },
      });
    }

    if (createPostDto.tagIds?.length) {
      tags = await this.tagRepository.find({
        where: { id: In(createPostDto.tagIds) },
      });
    }

    // Set publishedAt if status is published
    let publishedAt: Date | null = null;
    if (createPostDto.status === PostStatus.PUBLISHED) {
      publishedAt = new Date();
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      slug,
      author,
      authorId: author.id,
      categories,
      tags,
      publishedAt: publishedAt || undefined,
    });

    const savedPost = await this.postsRepository.save(post);

    // Update category and tag post counts
    await this.updateCategoryPostCounts(categories);
    await this.updateTagPostCounts(tags);

    return savedPost;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    author: User,
  ): Promise<Post> {
    const post = await this.findOne(id);

    // Check if user is author or admin
    if (post.authorId !== author.id && author.role !== 'admin') {
      throw new BadRequestException('You can only edit your own posts');
    }

    // Generate slug if title is updated and slug is not provided
    let slug = updatePostDto.slug;
    if (updatePostDto.title && !slug) {
      slug = generateSlug(updatePostDto.title);

      // Check if slug already exists (excluding current post)
      const existingSlugs = await this.postsRepository
        .createQueryBuilder('post')
        .select('post.slug')
        .where('post.id != :id', { id })
        .getRawMany();

      const slugs = existingSlugs.map((item) => item.post_slug);
      slug = generateUniqueSlug(slug, slugs);
    }

    // Handle categories and tags
    let categories: Category[] = [];
    let tags: Tag[] = [];

    if (updatePostDto.categoryIds?.length) {
      categories = await this.categoryRepository.find({
        where: { id: In(updatePostDto.categoryIds) },
      });
    }

    if (updatePostDto.tagIds?.length) {
      tags = await this.tagRepository.find({
        where: { id: In(updatePostDto.tagIds) },
      });
    }

    // Set publishedAt if status is changed to published
    let publishedAt: Date | null = post.publishedAt;
    if (
      updatePostDto.status === PostStatus.PUBLISHED &&
      post.status !== PostStatus.PUBLISHED
    ) {
      publishedAt = new Date();
    }

    // Update post
    await this.postsRepository.update(id, {
      ...updatePostDto,
      slug,
      categories,
      tags,
      publishedAt: publishedAt || undefined, // Thay null bằng undefined
    });

    // Update category and tag post counts
    await this.updateCategoryPostCounts(categories);
    await this.updateTagPostCounts(tags);

    return await this.findOne(id);
  }

  async findAll(
    filterDto?: PostFilterDto,
  ): Promise<{ posts: Post[]; total: number }> {
    const {
      status,
      categoryId,
      tagId,
      authorId,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto || {};

    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.reactions', 'reactions');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    if (categoryId) {
      queryBuilder.andWhere('categories.id = :categoryId', { categoryId });
    }

    if (tagId) {
      queryBuilder.andWhere('tags.id = :tagId', { tagId });
    }

    if (authorId) {
      queryBuilder.andWhere('post.authorId = :authorId', { authorId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search OR post.excerpt ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`post.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    return { posts, total };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'categories', 'tags', 'comments', 'reactions'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Increment view count
    post.viewCount += 1;
    await this.postsRepository.save(post);

    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { slug },
      relations: ['author', 'categories', 'tags', 'comments', 'reactions'],
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    // Increment view count
    post.viewCount += 1;
    await this.postsRepository.save(post);

    return post;
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return await this.postsRepository.find({
      where: { author: { id: authorId } },
      relations: ['author', 'categories', 'tags', 'comments', 'reactions'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string, author: User): Promise<void> {
    const post = await this.findOne(id);

    // Check if user is author or admin
    if (post.authorId !== author.id && author.role !== 'admin') {
      throw new BadRequestException('You can only delete your own posts');
    }

    await this.postsRepository.remove(post);

    // Update category and tag post counts
    if (post.categories?.length) {
      await this.updateCategoryPostCounts(post.categories);
    }
    if (post.tags?.length) {
      await this.updateTagPostCounts(post.tags);
    }
  }

  async updateStatus(
    id: string,
    status: PostStatus,
    author: User,
  ): Promise<Post> {
    const post = await this.findOne(id);

    // Check if user is author or admin
    if (post.authorId !== author.id && author.role !== 'admin') {
      throw new BadRequestException('You can only update your own posts');
    }

    let publishedAt: Date | null = post.publishedAt;
    if (
      status === PostStatus.PUBLISHED &&
      post.status !== PostStatus.PUBLISHED
    ) {
      publishedAt = new Date();
    }

    await this.postsRepository.update(id, {
      status,
      publishedAt: publishedAt || undefined,
    }); // Thay null bằng undefined

    return await this.findOne(id);
  }

  async getPublishedPosts(): Promise<Post[]> {
    return await this.postsRepository.find({
      where: { status: PostStatus.PUBLISHED },
      relations: ['author', 'categories', 'tags'],
      order: { publishedAt: 'DESC' },
    });
  }

  async getDraftPosts(authorId: string): Promise<Post[]> {
    return await this.postsRepository.find({
      where: {
        status: PostStatus.DRAFT,
        authorId,
      },
      relations: ['author', 'categories', 'tags'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getScheduledPosts(): Promise<Post[]> {
    return await this.postsRepository.find({
      where: {
        status: PostStatus.DRAFT,
        scheduledAt: Not(IsNull()),
      },
      relations: ['author', 'categories', 'tags'],
      order: { scheduledAt: 'ASC' },
    });
  }

  private async updateCategoryPostCounts(
    categories: Category[],
  ): Promise<void> {
    for (const category of categories) {
      const postCount = await this.postsRepository.count({
        where: { categories: { id: category.id } },
      });
      await this.categoryRepository.update(category.id, { postCount });
    }
  }

  private async updateTagPostCounts(tags: Tag[]): Promise<void> {
    for (const tag of tags) {
      const postCount = await this.postsRepository.count({
        where: { tags: { id: tag.id } },
      });
      await this.tagRepository.update(tag.id, { postCount });
    }
  }

  // Method mới để xử lý dữ liệu blog từ frontend
  async createBlogPost(
    createBlogPostDto: CreateBlogPostDto,
    author: User,
  ): Promise<Post> {
    // Tìm hoặc tạo category
    let category: Category | null = null;
    if (createBlogPostDto.category) {
      category = await this.categoryRepository.findOne({
        where: { slug: createBlogPostDto.category },
      });

      if (!category) {
        // Tạo category mới nếu chưa tồn tại
        category = this.categoryRepository.create({
          name: createBlogPostDto.category,
          slug: createBlogPostDto.category,
          description: `Category for ${createBlogPostDto.category}`,
        });
        category = await this.categoryRepository.save(category);
      }
    }

    // Xử lý tags
    let tags: Tag[] = [];
    if (createBlogPostDto.tags?.length) {
      for (const tagName of createBlogPostDto.tags) {
        let tag = await this.tagRepository.findOne({
          where: { name: tagName },
        });

        if (!tag) {
          // Tạo tag mới nếu chưa tồn tại
          tag = this.tagRepository.create({
            name: tagName,
            slug: generateSlug(tagName),
            description: `Tag for ${tagName}`,
          });
          tag = await this.tagRepository.save(tag);
        }
        tags.push(tag);
      }
    }

    // Xử lý thumbnail
    let thumbnailUrl: any = null;
    if (
      createBlogPostDto.thumbnail &&
      typeof createBlogPostDto.thumbnail === 'object'
    ) {
      // Nếu thumbnail là object, có thể chứa URL hoặc data
      thumbnailUrl =
        createBlogPostDto.thumbnail.url ||
        createBlogPostDto.thumbnail.src ||
        null;
    } else if (typeof createBlogPostDto.thumbnail === 'string') {
      thumbnailUrl = createBlogPostDto.thumbnail;
    }

    // Xử lý publishDate
    let publishedAt: Date | null = null;
    if (createBlogPostDto.publishDate) {
      publishedAt = new Date(createBlogPostDto.publishDate);
    } else if (createBlogPostDto.status === PostStatus.PUBLISHED) {
      publishedAt = new Date();
    }

    // Tạo post
    const post = this.postsRepository.create({
      title: createBlogPostDto.title,
      slug: createBlogPostDto.slug,
      content: createBlogPostDto.content,
      excerpt: createBlogPostDto.description, // Sử dụng description làm excerpt
      thumbnail: thumbnailUrl || undefined,
      status: createBlogPostDto.status,
      type: PostType.ARTICLE, // Mặc định là article
      seoTitle: createBlogPostDto.seoTitle || undefined,
      seoDescription: createBlogPostDto.seoDescription || undefined,
      seoKeywords: createBlogPostDto.seoKeywords || undefined,
      publishedAt: publishedAt || undefined, // Thay null bằng undefined
      author,
      authorId: author.id,
      categories: category ? [category] : [],
      tags,
    });

    const savedPost = await this.postsRepository.save(post);

    // Cập nhật số lượng post trong category và tags
    if (category) {
      await this.updateCategoryPostCounts([category]);
    }
    if (tags.length > 0) {
      await this.updateTagPostCounts(tags);
    }

    return savedPost;
  }
}
