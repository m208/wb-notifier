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

    return res.sendFile(join(__dirname, '..', '..', 'public', 'login.html'));
  }

  @UseGuards(AuthGuard)
  @Get('/app-settings')
  getSettings(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'settings.html'));
  }
}
