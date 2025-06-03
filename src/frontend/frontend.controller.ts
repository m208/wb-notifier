import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class FrontendController {
  @Get('/')
  root(@Res() res: Response) {
    res.redirect('/login');
  }

  @Get('/login')
  getLogin(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'login.html'));
  }

  @UseGuards(AuthGuard)
  @Get('/settings')
  getSettings(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'settings.html'));
  }
}
