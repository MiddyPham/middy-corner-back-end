import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createReactionDto: CreateReactionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.reactionsService.create(createReactionDto, req.user);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.reactionsService.findByPost(postId);
  }

  @Get('post/:postId/counts')
  getReactionCounts(@Param('postId') postId: string) {
    return this.reactionsService.getReactionCounts(postId);
  }

  @Delete('post/:postId')
  @UseGuards(JwtAuthGuard)
  remove(@Param('postId') postId: string, @Request() req: RequestWithUser) {
    return this.reactionsService.remove(postId, req.user.id);
  }
}
