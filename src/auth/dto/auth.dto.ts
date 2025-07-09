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

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'https://example.com/avatar.jpg',
    },
  })
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  };
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