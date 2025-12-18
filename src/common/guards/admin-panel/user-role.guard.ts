import { ROLES_KEY } from "../../../modules/admin-panel/u-auth/decorator/user-roles.decorator";
import { UserRole } from "@common/enums/user.enum";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // If no roles specified → allow
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user as { role?: number };

        if (!user?.role) {
            throw new ForbiddenException('User role not found');
        }

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Access denied');
        }

        return true;
    }
}
