import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(dto);

    if (!token) {
      return res.status(401).send('Неверный логин или пароль');
    }

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/settings');
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    res.redirect('/login');
  }
}
