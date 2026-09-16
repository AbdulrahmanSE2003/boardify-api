import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      let customMessage = 'Unauthorized access. Please log in first.';

      if (info?.name === 'TokenExpiredError') {
        customMessage = 'Your token has expired. Please log in again.';
      } else if (info?.name === 'JsonWebTokenError') {
        customMessage = 'Invalid authentication token.';
      }

      throw (
        err ||
        new UnauthorizedException({
          statusCode: 401,
          message: customMessage,
          error: 'Unauthorized',
        })
      );
    }

    return user;
  }
}
