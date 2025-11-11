import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2) throw new UnauthorizedException();
    const token = parts[1];
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.NESTAUTH_SECRET ?? 'dev-secret',
      });
      // attach user payload to request; sub was user id in login
      req.user = { id: payload.sub, email: payload.email };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}