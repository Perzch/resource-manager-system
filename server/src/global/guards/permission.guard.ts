import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from '../permissions/permissions.enum';
import { IS_PERMISSION_KEY } from '../decorators/permission.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<PermissionEnum[]>(
      IS_PERMISSION_KEY,
      context.getHandler(),
    );
    // 如果没有设置权限要求, 则允许访问
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user) {
      const queryUser = await this.userService.findOne(user.sub);
      request.user = queryUser;
      return requiredPermissions.some(
        (permission) => permission & queryUser.role,
      );
    }
    return false;
  }
}
