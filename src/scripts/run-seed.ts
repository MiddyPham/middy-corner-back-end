import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Reaction } from '../reactions/entities/reaction.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Media } from '../media/entities/media.entity';
import { InitialSeed } from '../database/seeds/initial-seed';

async function runSeed() {
  const configService = new ConfigService();

  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get('DATABASE_HOST', 'localhost'),
    port: +configService.get('DATABASE_PORT', 5432),
    username: configService.get('DATABASE_USERNAME', 'postgres'),
    password: configService.get('DATABASE_PASSWORD', ''),
    database: configService.get('DATABASE_NAME', 'middy_corner'),
    entities: [User, Post, Comment, Reaction, Category, Tag, Media],
    synchronize: false, // Don't auto-sync during seeding
    ssl:
      configService.get('NODE_ENV') === 'production'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  });

  try {
    await dataSource.initialize();
    console.log('🔌 Database connected successfully');

    const seeder = new InitialSeed(dataSource);
    await seeder.run();

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
runSeed();
