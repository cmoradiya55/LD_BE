export const ROLES = {
    ADMIN: 1,
    MANAGER: 2,
    INSPECTOR: 3,
    STAFF: 4
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

export const ROLE_NAMES: Record<RoleType, string> = {
    [ROLES.ADMIN]: 'Admin',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.INSPECTOR]: 'Inspector',
    [ROLES.STAFF]: 'Staff'
};