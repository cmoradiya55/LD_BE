import { USER_ALLOW_UNVERIFIED_EMAIL } from "@common/decorators/user-allowed-verified-email.decorator";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";

// common/guards/email-verified.guard.ts
@Injectable()
export class UserEmailVerifiedGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private configService: ConfigService,
    ) { }

    canActivate(context: ExecutionContext): boolean {

        // 🚧 FEATURE FLAG (GLOBAL BYPASS)
        const requireVerification =
            this.configService.getOrThrow<boolean>(
                'adminSetting.requireEmailVerification',
            );

        if (!requireVerification) {
            return true; // ⬅️ EVERYTHING ALLOWED FOR NOW
        }

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
