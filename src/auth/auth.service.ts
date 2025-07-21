import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    return await this.usersService.findByEmail(email);
  }

  async loginWithEmail(email: string, password?: string) {
    console.log('loginWithEmail', email, password);

    if (!email || !password) {
      throw new UnauthorizedException({
        message: 'Email and password are required',
        code: 'EMAIL_AND_PASSWORD_REQUIRED',
        statusCode: 401,
      });
    }

    if (email && !password) {
      throw new UnauthorizedException({
        message: 'Password is required',
        code: 'PASSWORD_REQUIRED',
        statusCode: 401,
      });
    }
    const user = await this.usersService.findByEmail(email);

    console.log(user);

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    // Nếu user không phải OAuth, bắt buộc phải có password
    if (!user.googleId && !user.facebookId) {
      if (!password) {
        throw new UnauthorizedException({
          message: 'Password is required',
          code: 'PASSWORD_REQUIRED',
        });
      }
      if (!user.password) {
        throw new UnauthorizedException({
          message: 'User does not have a password set',
          code: 'USER_NO_PASSWORD_SET',
        });
      }
      const isPasswordValid = await (bcrypt as any).compare(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException({
          message: 'Invalid password',
          code: 'INVALID_PASSWORD',
        });
      }
    }

    return this.login(user);
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException({
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN',
      });
    }
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    let user = await this.usersService.findByGoogleId(req.user.googleId);

    if (!user) {
      user = await this.usersService.create({
        email: req.user.email,
        name: req.user.firstName + ' ' + req.user.lastName,
        avatar: req.user.picture,
        googleId: req.user.googleId,
      });
    }

    return this.login(user);
  }

  async facebookLogin(req) {
    if (!req.user) {
      return 'No user from facebook';
    }

    let user = await this.usersService.findByFacebookId(req.user.facebookId);

    if (!user) {
      user = await this.usersService.create({
        email: req.user.email,
        name: req.user.firstName + ' ' + req.user.lastName,
        avatar: req.user.picture,
        facebookId: req.user.facebookId,
      });
    }

    return this.login(user);
  }
}
