import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction, ReactionType } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { User } from '../users/entities/user.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
    private postsService: PostsService,
  ) {}

  async create(
    createReactionDto: CreateReactionDto,
    user: User,
  ): Promise<Reaction> {
    const post = await this.postsService.findOne(createReactionDto.postId);

    // Check if user already reacted to this post
    const existingReaction = await this.reactionsRepository.findOne({
      where: {
        user: { id: user.id },
        post: { id: post.id },
      },
    });

    if (existingReaction) {
      // Update existing reaction
      existingReaction.type = createReactionDto.type;
      return await this.reactionsRepository.save(existingReaction);
    }

    // Create new reaction
    const reaction = this.reactionsRepository.create({
      type: createReactionDto.type,
      user,
      post,
    });

    return await this.reactionsRepository.save(reaction);
  }

  async findByPost(postId: string): Promise<Reaction[]> {
    return await this.reactionsRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }

  async remove(postId: string, userId: string): Promise<void> {
    const reaction = await this.reactionsRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    await this.reactionsRepository.remove(reaction);
  }

  async getReactionCounts(
    postId: string,
  ): Promise<Record<ReactionType, number>> {
    const reactions = await this.reactionsRepository.find({
      where: { post: { id: postId } },
    });

    const counts = Object.values(ReactionType).reduce(
      (acc, type) => {
        acc[type] = 0;
        return acc;
      },
      {} as Record<ReactionType, number>,
    );

    reactions.forEach((reaction) => {
      counts[reaction.type]++;
    });

    return counts;
  }
}
