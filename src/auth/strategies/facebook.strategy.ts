import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface FacebookProfile extends Profile {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
}

@Injectable()
export class FacebookStrategy extends PassportStrategy<typeof Strategy>(
  Strategy,
  'facebook',
) {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID') as string,
      clientSecret: configService.get<string>(
        'FACEBOOK_CLIENT_SECRET',
      ) as string,
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL') as string,
      scope: ['email', 'public_profile'],
      profileFields: ['id', 'emails', 'name', 'picture'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: FacebookProfile,
    done: (error: any, user?: any) => void,
  ): void {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      facebookId: profile.id,
    };
    done(null, user);
  }
}
