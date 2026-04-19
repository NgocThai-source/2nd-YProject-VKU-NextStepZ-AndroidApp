import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Role-based Authorization Guard
 * Checks if the current user's role matches one of the allowed roles
 * Usage: @UseGuards(RoleGuard) @Roles('user', 'employer')
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // If no roles are specified, allow access
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    if (!user.role) {
      throw new ForbiddenException('User role not found');
    }

    // Check if user's role is in the allowed roles
    const hasRole = roles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${roles.join(', ')}, but user has role: ${user.role}`,
      );
    }

    return true;
  }
}
