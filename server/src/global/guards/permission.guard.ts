import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from '../permissions/permissions.enum';
import { IS_PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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
    const userPermissions: number = +user?.role;
    const flag = requiredPermissions.some(
      (permission) => permission & userPermissions,
    );
    return flag;
  }
}
