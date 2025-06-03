import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const token = req.cookies?.token;
    const user = this.authService.verify(token);

    if (!user) {
      res.redirect('/login');
      return false;
    }

    return true;
  }
}
