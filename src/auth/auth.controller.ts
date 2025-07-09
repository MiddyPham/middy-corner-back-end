import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginResponseDto,
  GoogleAuthDto,
  FacebookAuthDto,
  LoginDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login with email (Development only)',
    description: 'Login with email for development purposes',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.loginWithEmail(loginDto.email, loginDto.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Initiate Google OAuth flow',
    description: 'Redirects user to Google OAuth for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Redirects to Google OAuth',
    type: GoogleAuthDto,
  })
  async googleAuth() {
    // This route initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Handles the callback from Google OAuth and returns user data with JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication failed',
  })
  async googleAuthCallback(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: 'Initiate Facebook OAuth flow',
    description: 'Redirects user to Facebook OAuth for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Redirects to Facebook OAuth',
    type: FacebookAuthDto,
  })
  async facebookAuth() {
    // This route initiates the Facebook OAuth flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: 'Facebook OAuth callback',
    description:
      'Handles the callback from Facebook OAuth and returns user data with JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication failed',
  })
  async facebookAuthCallback(@Req() req) {
    return this.authService.facebookLogin(req);
  }
}
