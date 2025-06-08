import {
  Controller,
  Get,
  Render,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { ViewContextInterceptor } from './view-context.interceptor';

@Controller()
@UseInterceptors(ViewContextInterceptor)
export class FrontendController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  root(@Res() res: Response) {
    res.redirect('/app-settings');
  }

  @Get('/login')
  @Render('login')
  getLogin(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.token;
    const user = this.authService.verify(token);

    if (user) {
      return res.redirect('/app-settings');
    }

    return {
      layout: 'no-header',
      title: 'Вход',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/app-settings')
  @Render('settings')
  getSettings() {
    return {
      title: 'Настройки',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/access-tokens')
  @Render('access')
  getAccessTokens() {
    return {
      title: 'API ключи',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/stats')
  @Render('stats')
  getStats() {
    return {
      title: 'Текущий статус',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/logs')
  @Render('logs')
  getLogs() {
    return {
      title: 'Журнал',
    };
  }
}
