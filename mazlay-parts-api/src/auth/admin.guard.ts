import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.user?.role !== 'admin') {
      throw new ForbiddenException('Chỉ tài khoản Admin mới được phép thực hiện thao tác này');
    }

    return true;
  }
}
