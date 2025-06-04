import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private postsService: PostsService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    author: User,
  ): Promise<Comment> {
    const post = await this.postsService.findOne(createCommentDto.postId);

    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      author,
      post,
    });

    return await this.commentsRepository.save(comment);
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.author.id !== userId) {
      throw new Error('You are not authorized to delete this comment');
    }

    await this.commentsRepository.remove(comment);
  }
}
