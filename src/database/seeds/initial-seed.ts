import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Post, PostStatus, PostType } from '../../posts/entities/post.entity';
import * as bcrypt from 'bcrypt';

export class InitialSeed {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('🌱 Starting initial seed...');

    // Create admin user
    await this.createAdminUser();

    // Create categories
    await this.createCategories();

    // Create tags
    await this.createTags();

    // Create sample posts
    await this.createSamplePosts();

    console.log('✅ Initial seed completed!');
  }

  private async createAdminUser() {
    const userRepository = this.dataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'middycorner@gmail.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Password@123', 10);

      const adminUser = userRepository.create({
        email: 'middycorner@gmail.com',
        password: hashedPassword,
        name: 'Middy',
        role: UserRole.ADMIN,
      });

      await userRepository.save(adminUser);
      console.log('👤 Admin user created');
    } else {
      console.log('👤 Admin user already exists');
    }
  }

  private async createCategories() {
    const categoryRepository = this.dataSource.getRepository(Category);

    const categories = [
      {
        name: 'Backend Development',
        slug: 'backend-development',
        description: 'Articles about backend technologies',
      },
      {
        name: 'Frontend Development',
        slug: 'frontend-development',
        description: 'Articles about frontend technologies',
      },
      {
        name: 'Database',
        slug: 'database',
        description: 'Database related articles',
      },
      {
        name: 'DevOps',
        slug: 'devops',
        description: 'DevOps and deployment articles',
      },
      {
        name: 'Programming',
        slug: 'programming',
        description: 'General programming articles',
      },
      {
        name: 'Tutorial',
        slug: 'tutorial',
        description: 'Step-by-step tutorials',
      },
    ];

    for (const categoryData of categories) {
      const existingCategory = await categoryRepository.findOne({
        where: { slug: categoryData.slug },
      });

      if (!existingCategory) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`📂 Category "${categoryData.name}" created`);
      }
    }
  }

  private async createTags() {
    const tagRepository = this.dataSource.getRepository(Tag);

    const tags = [
      { name: 'NestJS', slug: 'nestjs' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'TypeORM', slug: 'typeorm' },
      { name: 'JWT', slug: 'jwt' },
      { name: 'OAuth', slug: 'oauth' },
      { name: 'API', slug: 'api' },
      { name: 'Authentication', slug: 'authentication' },
      { name: 'Database', slug: 'database' },
      { name: 'Backend', slug: 'backend' },
    ];

    for (const tagData of tags) {
      const existingTag = await tagRepository.findOne({
        where: { slug: tagData.slug },
      });

      if (!existingTag) {
        const tag = tagRepository.create(tagData);
        await tagRepository.save(tag);
        console.log(`🏷️ Tag "${tagData.name}" created`);
      }
    }
  }

  private async createSamplePosts() {
    const postRepository = this.dataSource.getRepository(Post);
    const categoryRepository = this.dataSource.getRepository(Category);
    const tagRepository = this.dataSource.getRepository(Tag);
    const userRepository = this.dataSource.getRepository(User);

    // Get admin user
    const adminUser = await userRepository.findOne({
      where: { email: 'middycorner@gmail.com' },
    });

    if (!adminUser) {
      console.log('❌ Admin user not found, skipping sample posts');
      return;
    }

    // Get backend category
    const backendCategory = await categoryRepository.findOne({
      where: { slug: 'backend-development' },
    });

    // Get some tags
    const nestjsTag = await tagRepository.findOne({
      where: { slug: 'nestjs' },
    });
    const typescriptTag = await tagRepository.findOne({
      where: { slug: 'typescript' },
    });
    const apiTag = await tagRepository.findOne({ where: { slug: 'api' } });

    const samplePosts = [
      {
        title: 'Getting Started with NestJS',
        slug: 'getting-started-with-nestjs',
        content: `
# Getting Started with NestJS

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

## Features

- **TypeScript Support**: Built with TypeScript for better developer experience
- **Modular Architecture**: Easy to organize code with modules
- **Dependency Injection**: Powerful DI container
- **Decorators**: Clean and readable code with decorators

## Installation

\`\`\`bash
npm i -g @nestjs/cli
nest new project-name
\`\`\`

## Basic Example

\`\`\`typescript
import { Controller, Get } from '@nestjs/common';

@Controller('hello')
export class HelloController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
\`\`\`
        `,
        excerpt:
          'Learn how to get started with NestJS framework for building scalable backend applications.',
        author: adminUser,
        category: backendCategory,
        tags: [nestjsTag, typescriptTag, apiTag].filter(Boolean) as Tag[],
        status: PostStatus.PUBLISHED,
        type: PostType.ARTICLE,
        publishedAt: new Date(),
      },
      {
        title: 'Building REST APIs with TypeScript',
        slug: 'building-rest-apis-with-typescript',
        content: `
# Building REST APIs with TypeScript

TypeScript provides excellent tooling and type safety for building REST APIs.

## Benefits

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: IntelliSense and refactoring
- **Maintainability**: Easier to maintain large codebases

## Example API Structure

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  @Get()
  findAll(): User[] {
    return [];
  }
}
\`\`\`
        `,
        excerpt:
          'Explore how to build robust REST APIs using TypeScript for better type safety and developer experience.',
        author: adminUser,
        category: backendCategory,
        tags: [typescriptTag, apiTag].filter(Boolean) as Tag[],
        status: PostStatus.PUBLISHED,
        type: PostType.ARTICLE,
        publishedAt: new Date(),
      },
    ];

    for (const postData of samplePosts) {
      const existingPost = await postRepository.findOne({
        where: { slug: postData.slug },
      });

      if (!existingPost) {
        const post = postRepository.create(postData);
        await postRepository.save(post);
        console.log(`📝 Sample post "${postData.title}" created`);
      }
    }
  }
}
