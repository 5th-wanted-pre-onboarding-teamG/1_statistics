import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from 'passport-local';
import {Repository} from "typeorm";
import {Users} from "../entities/Users";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(Users) private readonly userRepository: Repository<Users>) {
        super();
    }

    async validate(email: string, pass: string): Promise<any> {
        const findUser = await this.userRepository.findOne({
            where: {email},
        })

        if (!findUser) {
            throw new NotFoundException('해당 사용자 정보를 찾을 수 없습니다.')
        }

        const validate = await bcrypt.compare(pass, findUser.password, 12);

        if (!validate) {
            throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.')
        }

        const {password, ...result} = findUser;
        return result;
    }
}