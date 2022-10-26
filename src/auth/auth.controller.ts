import {Controller, Post, UseGuards} from "@nestjs/common";
import {LocalGuard} from "./auth.guard";
import {User} from "./auth.decorator";

@Controller('auth')
export class AuthController {

    @Post('login')
    @UseGuards(LocalGuard)
    async login(@User() user) {
        return user;
    }
}