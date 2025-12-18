import { USER_ALLOW_UNVERIFIED_DOCUMENT } from "../../../modules/admin-panel/u-auth/decorator/user-allowed-unverified-document.decorator";
import { USER_ALLOW_UNVERIFIED_EMAIL } from "../../../modules/admin-panel/u-auth/decorator/user-allowed-unverified-email.decorator";
import { UserDocumentVerificationStatus } from "@common/enums/user.enum";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";

// common/guards/email-verified.guard.ts
@Injectable()
export class UserDocumentVerifiedGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private configService: ConfigService,
    ) { }

    canActivate(context: ExecutionContext): boolean {

        // 🚧 FEATURE FLAG (GLOBAL BYPASS)
        const requireVerification =
            this.configService.getOrThrow<boolean>(
                'adminSetting.requireDocumentVerification',
            );

        if (!requireVerification) {
            return true; // ⬅️ EVERYTHING ALLOWED FOR NOW
        }

        const allowUnverified = this.reflector.getAllAndOverride<boolean>(
            USER_ALLOW_UNVERIFIED_DOCUMENT,
            [context.getHandler(), context.getClass()],
        );

        if (allowUnverified) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user?.document_status || user.document_status !== UserDocumentVerificationStatus.VERIFIED) {
            throw new ForbiddenException('Document not verified yet');
        }

        return true;
    }
}
