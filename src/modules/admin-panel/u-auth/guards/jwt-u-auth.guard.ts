import { IS_PUBLIC } from '../decorator/user-public.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UJwtAuthGuard extends AuthGuard('user-jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC,
            [context.getHandler(), context.getClass()],
        );
        console.log('isPublic', isPublic);

        if (isPublic) {
            return true; // ⬅️ bypass JWT
        }

        return super.canActivate(context);
    }
}