import {
  CanActivate,
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { ENV } from 'src/constants';

@Injectable()
export class LocalGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private authService: AuthService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [mix] = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest()
    console.log(request)
    const token = request.headers['authorization'];
    console.log(token)

    if (!token && !mix) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    if (!token && mix) {
      return true;
    }
    try {
      const payload = this.jwtService.verify(token.split("Bearer ")[1], {
        secret: ENV.JWT_SECRET,
        ignoreExpiration: false,
      });
      const session = await this.authService.validateToken(payload);

      if (!session.active) {
        throw new UnauthorizedException('Usuario no autorizado');
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = { ...payload, jwtToken: token };
    } catch {
      throw new UnauthorizedException('Usuario no autorizado');
    }
    return true;
  }
}
