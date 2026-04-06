import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';
import { User } from '@entity/user/user.entity';

export class AdminProfileResource extends BaseResource<User> {
    toJSON() {
        return {
            id: CommonHelper.number(this.data.id),
            selfieImage: CommonHelper.buildImageUrl(this.data.selfie_image),
            fullName: CommonHelper.text(this.data.name),

            countryCode: CommonHelper.number(this.data.country_code),
            mobileNo: CommonHelper.number(this.data.mobile_number),
            isMobileVerified: CommonHelper.bool(this.data.is_mobile_verified),

            email: CommonHelper.text(this.data.email),
            isEmailVerified: CommonHelper.bool(this.data.is_email_verified),
        };
    }
}
