import {Module} from '@nestjs/common';
import {PassportModule} from "@nestjs/passport";
import {AuthStrategy} from "./auth.strategy";
import {Users} from "../entities/Users";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthController} from "./auth.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        PassportModule.register({defaultStrategy: 'local', session: true}),
    ],
    providers: [AuthStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
