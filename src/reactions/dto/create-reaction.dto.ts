import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ReactionType } from '../entities/reaction.entity';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  @IsNotEmpty()
  type: ReactionType;

  @IsUUID()
  @IsNotEmpty()
  postId: string;
}
