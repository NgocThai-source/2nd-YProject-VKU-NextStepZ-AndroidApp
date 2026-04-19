import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Vui lòng đăng nhập');
        }

        if (user.role !== 'admin') {
            throw new ForbiddenException('Chỉ Admin mới có quyền truy cập');
        }

        return true;
    }
}
