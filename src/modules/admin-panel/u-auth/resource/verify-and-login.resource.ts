import { UserDocumentVerificationStatus } from '@common/enums/user.enum';
import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';
import { User } from '@entity/user/user.entity';

export class UserVerifyAndLoginResource extends BaseResource<any> {
    toJSON() {
        const user: User = this.data.user;
        const response: any = {
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
        };

        if (user.document_status === UserDocumentVerificationStatus.REJECTED) {
            response.baseImageUrl = CommonHelper.text(process.env.AWS_S3_PUBLIC_BASE_URL)
            response.selfieImage = CommonHelper.text(user.selfie_image);
            response.aadharFrontImage = CommonHelper.text(user.aadhar_front_image);
            response.aadharBackImage = CommonHelper.text(user.aadhar_back_image);
            response.panImage = CommonHelper.text(user.pan_image);
            response.aadharNumber = CommonHelper.text(user.aadhar_number);
            response.panNumber = CommonHelper.text(user.pan_number);
            response.remarks = CommonHelper.text(user.reject_reason);
        }
        return response;
    }
}
