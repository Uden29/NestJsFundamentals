import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtArtistGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log('user => ', user);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (user.artistId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return user;
    }
    throw err || new UnauthorizedException();
  }
}
