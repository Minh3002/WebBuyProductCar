import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context, status) {
    // Không ném lỗi nếu không có token
    // Nếu có token hợp lệ, trả về user
    // Nếu không có token hoặc token không hợp lệ, trả về undefined/null
    return user;
  }
}
