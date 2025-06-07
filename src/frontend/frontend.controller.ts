import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class FrontendController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  root(@Res() res: Response) {
    res.redirect('/app-settings');
  }

  @Get('/login')
  getLogin(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.token;
    const user = this.authService.verify(token);
    if (user) {
      return res.redirect('/app-settings');
    }

    return res.render('login', {
      title: 'Вход',
      layout: 'layouts/main',
      nav: [],
    });
  }

  @UseGuards(AuthGuard)
  @Get('/app-settings')
  getSettings(@Res() res: Response) {
    return res.render('settings', {
      title: 'Настройки',
      layout: 'layouts/main',
      nav: [
        { label: 'Настройки', link: '/app-settings' },
        { label: 'Лог', link: '/log' },
        { label: 'Выход', link: '/auth/logout' },
      ],
      trackingOptions: [
        { name: 'trackNewOrders', label: 'Новые заказы FBS', checked: true },
        { name: 'trackNewFeedbacks', label: 'Новые отзывы', checked: true },
        {
          name: 'trackNewQuestions',
          label: 'Новые вопросы покупателей',
          checked: true,
        },
        {
          name: 'trackNewClaims',
          label: 'Новые заявки на возврат',
          checked: true,
        },
        {
          name: 'trackNewChatMessages',
          label: 'Новые сообщения от покупателей',
          checked: true,
        },
        {
          name: 'trackTokenExpiration',
          label: 'Актуальность токена доступа к API Wildberries',
          checked: true,
        },
      ],
    });
  }
}
