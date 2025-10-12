import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from 'src/types/payload.type';
import * as speakeasy from 'speakeasy';
import { Enable2FAType } from 'src/types/auth.type';
import { UpdateResult } from 'typeorm/browser';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
    private configService: ConfigService,
  ) {}

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret! };
    }
    const secret = speakeasy.generateSecret(); //3
    console.log('secret => ', secret);
    user.twoFASecret = secret.base32; //4
    await this.userService.updateSecretKey(user.id, user.twoFASecret); //5
    return { secret: user.twoFASecret };
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findById(userId);
      // verify the secret with a token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret!,
        token: token,
        encoding: 'base32',
      });

      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (error) {
      console.log('err => ', error);
      throw new UnauthorizedException('Error Verifying Token');
    }
  }

  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.userService.findOne(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password!,
    ); //non-null exception
    if (passwordMatched) {
      //   const { password, ...rest } = user;
      //   return rest;

      const payload: PayloadType = { email: user.email, userId: user.id };

      const artist = await this.artistService.findArtist(user.id);

      if (artist) {
        payload.artistId = artist.id;
      }

      // If user has enabled 2FA and have the secret key then
      if (user.enable2FA && user.twoFASecret) {
        //1.
        // sends the validateToken request link
        // else otherwise sends the json web token in the response
        return {
          //2.
          validate2FA: 'http://localhost:3000/auth/validate-2fa',
          message:
            'Please send the one-time password/token from your Google Authenticator App',
        };
      }
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Password does not match.');
    }
  }

  getEnvVariables() {
    return {
      port: this.configService.get<number>('port'),
      secret: this.configService.get<string>('secret'),
    };
  }
}
