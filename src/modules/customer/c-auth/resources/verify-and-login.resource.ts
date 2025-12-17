import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class VerifyAndLoginResource extends BaseResource<any> {
    toJSON() {
        const customer = this.data.customer;
        return {
            accessToken: CommonHelper.text(this.data.accessToken),
            expiresInMs: CommonHelper.number(this.data?.expiresInMs),
            isNewDevice: CommonHelper.bool(this.data.isNewDevice),

            profile_image: CommonHelper.buildImageUrl(customer.profile_image),
            fullName: CommonHelper.text(customer.full_name),
            countryCode: CommonHelper.number(customer.mobile_country_code),
            mobileNo: CommonHelper.number(customer.mobile_no),
            cityId:CommonHelper.number(customer.city_id),

            isBlocked: CommonHelper.bool(customer.is_blocked),
            blockedReason: CommonHelper.text(customer.blocked_reason),
            lockedUntil: customer.locked_until,
        };
    }
}
