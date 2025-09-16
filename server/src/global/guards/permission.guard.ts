import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from '../permissions/permissions.enum';

export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<PermissionEnum[]>(
      'permissions',
      context.getHandler(),
    );
    // 如果没有设置权限要求, 则允许访问
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return (
      user &&
      user.permissions &&
      requiredPermissions.some((permission) =>
        user.permissions.includes(permission),
      )
    );
  }
}
