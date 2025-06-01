import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { join } from 'path';

@Controller()
export class FrontendController {
  @Get('/login')
  getLogin(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'login.html'));
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/settings')
  getSettings(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'settings.html'));
  }

  @Get('/')
  root(@Res() res: Response) {
    res.redirect('/login');
  }
}
