import {Controller, Get, Post, Req, UseGuards} from "@nestjs/common";
import {AuthenticatedGuard, AuthLocalGuard} from "./auth.guard";

@Controller('auth')
export class AuthController {

    @UseGuards(AuthLocalGuard)
    @Post('login')
    async login() {}

    @UseGuards(AuthenticatedGuard)
    @Get('logout')
    async logout(@Req() req) {
        req.session.destroy();
    }
}