import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRank } from '../entities/enums/userRank';
import { Users } from '../entities/Users';

@Injectable()
export class AuthLocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  /**
   * 세션에 유저정보를 확인하여 인증 상태를 확인
   * @param context 실행 컨텍스트
   * @returns 세션에 저장되어있는 유저 정보
   */
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const user = request?.session?.passport?.user;

    // 세션에 저장되어 있는 유저 정보 반환
    if (user) {
      return user;
    }

    throw new UnauthorizedException();
  }
}

@Injectable()
export class OperateGuard implements CanActivate {
  /**
   * 세션에 유저정보를 확인하여 인증 상태를 확인
   * @param context 실행 컨텍스트
   * @returns 세션에 저장되어있는 유저 정보
   */
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const user = request?.session?.passport?.user;

    // 세션에 저장되어 있는 유저 정보 반환
    if (this.isOperateRank(user)) {
      return user;
    }

    // 사용자 정보가 세션에 없거나 권한이 없을 시 에러 처리
    throw new UnauthorizedException();
  }

  /**
   * 유저의 권한이 운영자 또는 관리자인지 확인
   * @param user
   * @
   */
  isOperateRank(user: Users): boolean {
    console.log(user.rank);
    return (
      user && (user.rank === UserRank.MANAGER || user.rank === UserRank.ADMIN)
    );
  }
}
