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
    console.log(email, password);
    const user = await this.usersService.findByEmail(email);

    console.log(user);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Nếu user không phải OAuth, bắt buộc phải có password
    if (!user.googleId && !user.facebookId) {
      if (!password) {
        throw new UnauthorizedException('Password is required');
      }
      if (!user.password) {
        throw new UnauthorizedException('User does not have a password set');
      }
      const isPasswordValid = await (bcrypt as any).compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
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
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
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
