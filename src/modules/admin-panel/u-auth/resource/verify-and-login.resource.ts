import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class UserVerifyAndLoginResource extends BaseResource<any> {
    toJSON() {
        const user = this.data.user;
        return {
            accessToken: CommonHelper.text(this.data.accessToken),
            expiresInMs: CommonHelper.number(this.data?.expiresInMs),
            fullName: CommonHelper.text(user.name),
            countryCode: CommonHelper.number(user.country_code),
            mobileNo: CommonHelper.number(user.mobile_number),
            isMobileVerified: CommonHelper.bool(user.is_mobile_verified),
            email: CommonHelper.text(user.email),
            isEmailVerified: CommonHelper.bool(user.is_email_verified),
            roleId: CommonHelper.number(user.role),
            role: CommonHelper.text(CommonHelper.getRoleName(user.role)),
            documentStatus: CommonHelper.number(user.document_status),
            documentStatusName: CommonHelper.text(CommonHelper.getUserDocumentStatusName(user.document_status)),
            remarks: CommonHelper.text(user.reject_reason),
        };
    }
}
