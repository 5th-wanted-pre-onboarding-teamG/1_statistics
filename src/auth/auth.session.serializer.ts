import {PassportSerializer} from "@nestjs/passport";
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "../entities/Users";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(@InjectRepository(Users) private readonly userRepository: Repository<Users>) {
        super();
    }

    serializeUser(user: Users, done: (err, user:Users) => void) {
        done(null, user)
    }

    async deserializeUser(user: Users, done: (err, user:Users) => void) {
        const userInfo = await this.userRepository.findOneBy({userId: user.userId})
        if (userInfo) {
            return done(null, userInfo);
        }
        return done(null, null);
    }
}