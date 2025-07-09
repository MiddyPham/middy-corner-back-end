import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  UpdatePostDto,
  PostResponseDto,
  PostFilterDto,
  CreateBlogPostDto,
} from './dto/post.dto';
import { UserRole } from '../users/entities/user.entity';
import { PostStatus } from './entities/post.entity';
import { User } from '../users/entities/user.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new post (Admin only)',
    description:
      'Create a new blog post with full content management features.',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  create(@Body() createPostDto: CreatePostDto, @Request() req: { user: User }) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Post('blog')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new blog post from frontend data (Admin only)',
    description: 'Create a new blog post with data format from frontend.',
  })
  @ApiResponse({
    status: 201,
    description: 'Blog post created successfully',
    type: PostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  createBlogPost(
    @Body() createBlogPostDto: CreateBlogPostDto,
    @Request() req: { user: User },
  ) {
    return this.postsService.createBlogPost(createBlogPostDto, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update a post (Admin only)',
    description:
      'Update an existing blog post. Only post author or admin can edit.',
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: { user: User },
  ) {
    return this.postsService.update(id, updatePostDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete a post (Admin only)',
    description: 'Delete a blog post. Only post author or admin can delete.',
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.postsService.remove(id, req.user);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update post status (Admin only)',
    description: 'Update the status of a post (draft, published, hidden).',
  })
  @ApiResponse({
    status: 200,
    description: 'Post status updated successfully',
    type: PostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: PostStatus },
    @Request() req: { user: User },
  ) {
    return this.postsService.updateStatus(id, body.status, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all posts with filtering',
    description:
      'Retrieve posts with advanced filtering, search, and pagination.',
  })
  @ApiQuery({ name: 'status', enum: PostStatus, required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'tagId', required: false })
  @ApiQuery({ name: 'authorId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', enum: ['ASC', 'DESC'], required: false })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        posts: {
          type: 'array',
          items: { $ref: '#/components/schemas/PostResponseDto' },
        },
        total: { type: 'number' },
      },
    },
  })
  findAll(@Query() filterDto: PostFilterDto) {
    return this.postsService.findAll(filterDto);
  }

  @Get('published')
  @ApiOperation({
    summary: 'Get published posts',
    description: 'Retrieve only published posts for public display.',
  })
  @ApiResponse({
    status: 200,
    description: 'Published posts retrieved successfully',
    type: [PostResponseDto],
  })
  getPublishedPosts() {
    return this.postsService.getPublishedPosts();
  }

  @Get('drafts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get draft posts (Admin only)',
    description: 'Retrieve draft posts for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Draft posts retrieved successfully',
    type: [PostResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  getDraftPosts(@Request() req: { user: User }) {
    return this.postsService.getDraftPosts(req.user.id);
  }

  @Get('scheduled')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get scheduled posts (Admin only)',
    description: 'Retrieve posts that are scheduled for future publication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Scheduled posts retrieved successfully',
    type: [PostResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  getScheduledPosts() {
    return this.postsService.getScheduledPosts();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieve a specific post by ID with full details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    type: PostResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get post by slug',
    description: 'Retrieve a specific post by slug (URL-friendly identifier).',
  })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    type: PostResponseDto,
  })
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get('author/:authorId')
  @ApiOperation({
    summary: 'Get posts by author',
    description: 'Retrieve all posts by a specific author.',
  })
  @ApiResponse({
    status: 200,
    description: 'Posts by author',
    type: [PostResponseDto],
  })
  findByAuthor(@Param('authorId') authorId: string) {
    return this.postsService.findByAuthor(authorId);
  }
}
