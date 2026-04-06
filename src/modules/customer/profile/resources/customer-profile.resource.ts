import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';
import { Customer } from '@entity/customer/customer.entity';

export class CustomerProfileResource extends BaseResource<Customer> {
    toJSON() {
        return {
            id: CommonHelper.number(this.data.id),
            profileImage: CommonHelper.buildImageUrl(this.data.profile_image),
            fullName: CommonHelper.text(this.data.full_name),
            
            countryCode: CommonHelper.number(this.data.mobile_country_code),
            mobileNo: CommonHelper.number(this.data.mobile_no),
            isMobileVerified: CommonHelper.bool(this.data.is_mobile_verified),
            
            email: CommonHelper.text(this.data.email),
            isEmailVerified: CommonHelper.bool(this.data.is_email_verified),

            cityId: this.data.city ? CommonHelper.number(this.data.city.id) : null,
            cityName: this.data.city ? CommonHelper.text(CommonHelper.capitalizeWords(this.data.city.city_name)) : null,
            stateName: this.data.city ? CommonHelper.text(CommonHelper.capitalizeWords(this.data.city.state_name)) : null,
        };
    }
}
