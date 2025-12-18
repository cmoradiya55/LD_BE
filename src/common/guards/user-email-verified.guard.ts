import { USER_ALLOW_UNVERIFIED_EMAIL } from "@common/decorators/user-allowed-verified-email.decorator";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

// common/guards/email-verified.guard.ts
@Injectable()
export class UserEmailVerifiedGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const allowUnverified = this.reflector.getAllAndOverride<boolean>(
            USER_ALLOW_UNVERIFIED_EMAIL,
            [context.getHandler(), context.getClass()],
        );

        if (allowUnverified) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user?.is_email_verified) {
            throw new ForbiddenException('Email not verified');
        }

        return true;
    }
}
