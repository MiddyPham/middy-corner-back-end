import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Tạo admin user đầu tiên
    const adminUser = await usersService.createAdmin({
      email: 'admin@middycorner.com',
      name: 'Admin User',
      avatar: 'https://example.com/admin-avatar.jpg',
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log('\n🔐 You can now login with this admin account');
    console.log('📝 Only admin users can create posts');
  } catch (error: any) {
    if (error.code === '23505') {
      // PostgreSQL unique constraint violation
      console.log('⚠️  Admin user already exists');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  } finally {
    await app.close();
  }
}

createAdmin();
