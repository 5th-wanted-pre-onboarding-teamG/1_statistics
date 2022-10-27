import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, AuthLocalGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  /**
   * @url POST '/auth/login'
   * @description 로그인 성공/실패 여부를 반환합니다.
   */
  @UseGuards(AuthLocalGuard)
  @Post('login')
  login(): void {}

  /**
   * @url GET '/auth/logout'
   * @description 로그아웃 처리를 위해 세션을 제거합니다.
   */
  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout(@Req() req): void {
    req.session.destroy();
  }
}
