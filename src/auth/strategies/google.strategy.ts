import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GoogleProfile extends Profile {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID:
        (configService.get<string>('GOOGLE_CLIENT_ID') as string) ??
        'dummy-client-id',
      clientSecret:
        (configService.get<string>('GOOGLE_CLIENT_SECRET') as string) ??
        'dummy-client-secret',
      callbackURL:
        (configService.get<string>('GOOGLE_CALLBACK_URL') as string) ??
        'http://localhost:8001/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): void {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      googleId: profile.id,
    };
    done(null, user);
  }
}
