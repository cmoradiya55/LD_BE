export enum UserOtpType {
    REGISTRATION_OR_LOGIN = 1,
    EMAIL_VERIFY = 2,
    ACCOUNT_DELETE = 3,
}

// common/enums/user-role.enum.ts
export enum UserRole {
    ADMIN = 1,
    MANAGER = 2,
    INSPECTOR = 3,
    STAFF = 4,
}

export enum UserDocumentVerificationStatus {
    PENDING = 1,
    REQUEST_RAISE = 2,
    VERIFIED = 3,
    REJECTED = 4,
}
