import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'admin@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (optional for OAuth)',
    example: 'password123',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      email: 'user@example.com',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      role: 'ADMIN',
    },
  })
  user: {
    id: number;
    email: string;
    name: string;
    avatar: string;
    role: string;
  };
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'New JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;
}

export class GoogleAuthDto {
  @ApiProperty({
    description: 'Google OAuth callback URL',
    example: '/auth/google/callback',
  })
  callbackUrl: string;
}

export class FacebookAuthDto {
  @ApiProperty({
    description: 'Facebook OAuth callback URL',
    example: '/auth/facebook/callback',
  })
  callbackUrl: string;
} 