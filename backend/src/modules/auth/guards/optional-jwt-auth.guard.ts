import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT Auth Guard - allows requests without token, but extracts user if token is present
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Try to authenticate, but don't fail if no token
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any) {
        // Don't throw error if no user - just return null/undefined
        return user;
    }
}
