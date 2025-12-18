    import { registerAs } from '@nestjs/config';

export const adminSettingConfig = registerAs('adminSetting', () => ({
    requireEmailVerification: process.env.ADMIN_REQUIRE_EMAIL_VERIFICATION === 'true',
    requireDocumentVerification: process.env.ADMIN_REQUIRE_DOCUMENT_VERIFICATION === 'true',
}));