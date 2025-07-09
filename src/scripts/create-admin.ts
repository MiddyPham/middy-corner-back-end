import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const configService = app.get(ConfigService);

  try {
    const hashedPassword = await hash(
      configService.get('PASSWORD_ADMIN') as string,
      10,
    );

    const adminUser = await usersService.createAdmin({
      email: 'middycorner@gmail.com',
      name: 'Middy',
      password: hashedPassword,
      avatar:
        'https://www.nme.com/wp-content/uploads/2021/06/planet-of-lana-2000x1270-1.jpg',
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log('\n🔐 Login credentials:');
    console.log(`   Email: admin@gmail.com`);
    console.log(`   Password: admin123`);
    console.log('\n📝 Only admin users can create posts');
  } catch (error: any) {
    if (error?.code === '23505') {
      // PostgreSQL unique constraint violation
      console.log('⚠️  Admin user already exists');
    } else {
      console.error('❌ Error creating admin user:', error?.message);
    }
  } finally {
    await app.close();
  }
}

createAdmin();
