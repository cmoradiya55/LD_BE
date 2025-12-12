// optional-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    // Don't throw error if no user - just return null
    return user || null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Call parent canActivate but catch any errors
    try {
      await super.canActivate(context);
    } catch {
      // Ignore auth errors - user will be null
    }
    return true; // Always allow the request
  }
}