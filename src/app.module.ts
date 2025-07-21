import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { MediaModule } from './media/media.module';
import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { Reaction } from './reactions/entities/reaction.entity';
import { Category } from './categories/entities/category.entity';
import { Tag } from './tags/entities/tag.entity';
import { Media } from './media/entities/media.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL') as string;
        const isProduction = configService.get('NODE_ENV') === 'production';

        if (databaseUrl) {
          // Use DATABASE_URL if available (for Render deployment)
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Post, Comment, Reaction, Category, Tag, Media],
            synchronize: !isProduction,
            ssl: isProduction
              ? {
                  rejectUnauthorized: false,
                  require: true,
                }
              : false,
            extra: isProduction
              ? {
                  ssl: {
                    rejectUnauthorized: false,
                    require: true,
                  },
                }
              : {},
          };
        } else {
          // Fallback to individual environment variables (for local development)
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: +configService.get('DATABASE_PORT', 5432),
            username: configService.get('DATABASE_USERNAME', 'postgres'),
            password: configService.get('DATABASE_PASSWORD', ''),
            database: configService.get('DATABASE_NAME', 'middy_corner'),
            entities: [User, Post, Comment, Reaction, Category, Tag, Media],
            synchronize: !isProduction,
            ssl: isProduction
              ? {
                  rejectUnauthorized: false,
                  require: true,
                }
              : false,
          };
        }
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
    CategoriesModule,
    TagsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
