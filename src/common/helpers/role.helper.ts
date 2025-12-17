// helpers/role.helper.ts

import { ROLES } from "@common/constants/user.constant";

export class RoleHelper {
    static isAdmin(user: any): boolean {
        return user?.role === ROLES.ADMIN;
    }

    static isManager(user: any): boolean {
        return user?.role === ROLES.MANAGER;
    }

    static isInspector(user: any): boolean {
        return user?.role === ROLES.INSPECTOR;
    }

    static isStaff(user: any): boolean {
        return user?.role === ROLES.STAFF;
    }
}