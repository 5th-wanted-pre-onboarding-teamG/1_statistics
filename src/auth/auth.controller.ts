import {Controller, Post, UseGuards} from "@nestjs/common";
import {AuthLocalGuard} from "./auth.guard";
import {User} from "./auth.decorator";

@Controller('auth')
export class AuthController {

    @UseGuards(AuthLocalGuard)
    @Post('login')
    async login(@User() user) {}
}