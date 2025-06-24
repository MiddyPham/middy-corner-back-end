import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
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
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, PostResponseDto } from './dto/post.dto';
import { UserRole } from '../users/entities/user.entity';

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
    description: 'Create a new blog post. Only admins can perform this action.',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Retrieve a list of all published posts. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all posts',
    type: [PostResponseDto],
  })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieve a specific post by ID. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    type: PostResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Get('author/:authorId')
  @ApiOperation({
    summary: 'Get posts by author',
    description: 'Retrieve all posts by a specific author. Public access.',
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
