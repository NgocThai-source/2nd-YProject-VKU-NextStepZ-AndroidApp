import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to specify allowed roles for an endpoint
 * Usage: @Roles('user', 'employer')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
