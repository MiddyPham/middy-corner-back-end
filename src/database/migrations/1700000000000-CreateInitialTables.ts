import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "password" VARCHAR(255),
        "firstName" VARCHAR(255),
        "lastName" VARCHAR(255),
        "role" VARCHAR(50) DEFAULT 'user',
        "isActive" BOOLEAN DEFAULT true,
        "googleId" VARCHAR(255),
        "facebookId" VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(255) UNIQUE NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tags table
    await queryRunner.query(`
      CREATE TABLE "tags" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(255) UNIQUE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create posts table
    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(255) UNIQUE NOT NULL,
        "content" TEXT NOT NULL,
        "excerpt" TEXT,
        "featuredImage" VARCHAR(255),
        "isPublished" BOOLEAN DEFAULT false,
        "publishedAt" TIMESTAMP,
        "authorId" INTEGER,
        "categoryId" INTEGER,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "fk_posts_author" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_posts_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL
      )
    `);

    // Create post_tags junction table
    await queryRunner.query(`
      CREATE TABLE "post_tags" (
        "postId" INTEGER NOT NULL,
        "tagId" INTEGER NOT NULL,
        CONSTRAINT "pk_post_tags" PRIMARY KEY ("postId", "tagId"),
        CONSTRAINT "fk_post_tags_post" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_post_tags_tag" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE
      )
    `);

    // Create comments table
    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" SERIAL PRIMARY KEY,
        "content" TEXT NOT NULL,
        "postId" INTEGER NOT NULL,
        "authorId" INTEGER,
        "parentId" INTEGER,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "fk_comments_post" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_comments_author" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_comments_parent" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE CASCADE
      )
    `);

    // Create reactions table
    await queryRunner.query(`
      CREATE TABLE "reactions" (
        "id" SERIAL PRIMARY KEY,
        "type" VARCHAR(50) NOT NULL,
        "postId" INTEGER,
        "commentId" INTEGER,
        "userId" INTEGER,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "fk_reactions_post" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_reactions_comment" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_reactions_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create media table
    await queryRunner.query(`
      CREATE TABLE "media" (
        "id" SERIAL PRIMARY KEY,
        "filename" VARCHAR(255) NOT NULL,
        "originalName" VARCHAR(255) NOT NULL,
        "mimeType" VARCHAR(100) NOT NULL,
        "size" INTEGER NOT NULL,
        "path" VARCHAR(500) NOT NULL,
        "url" VARCHAR(500),
        "uploadedById" INTEGER,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "fk_media_uploader" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "idx_posts_slug" ON "posts"("slug")`);
    await queryRunner.query(
      `CREATE INDEX "idx_posts_author" ON "posts"("authorId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_posts_category" ON "posts"("categoryId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_posts_published" ON "posts"("isPublished", "publishedAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_comments_post" ON "comments"("postId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_comments_author" ON "comments"("authorId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_reactions_post" ON "reactions"("postId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_reactions_comment" ON "reactions"("commentId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users_email" ON "users"("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_categories_slug" ON "categories"("slug")`,
    );
    await queryRunner.query(`CREATE INDEX "idx_tags_slug" ON "tags"("slug")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "idx_tags_slug"`);
    await queryRunner.query(`DROP INDEX "idx_categories_slug"`);
    await queryRunner.query(`DROP INDEX "idx_users_email"`);
    await queryRunner.query(`DROP INDEX "idx_reactions_comment"`);
    await queryRunner.query(`DROP INDEX "idx_reactions_post"`);
    await queryRunner.query(`DROP INDEX "idx_comments_author"`);
    await queryRunner.query(`DROP INDEX "idx_comments_post"`);
    await queryRunner.query(`DROP INDEX "idx_posts_published"`);
    await queryRunner.query(`DROP INDEX "idx_posts_category"`);
    await queryRunner.query(`DROP INDEX "idx_posts_author"`);
    await queryRunner.query(`DROP INDEX "idx_posts_slug"`);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TABLE "reactions"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "post_tags"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
