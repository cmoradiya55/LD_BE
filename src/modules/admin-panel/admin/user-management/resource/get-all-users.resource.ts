import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class GetAllUsersResource extends BaseResource<any> {
    toJSON() {
        return {
            id: CommonHelper.number(this.data.id),
            name: CommonHelper.text(this.data.name),
            countryCode: CommonHelper.number(this.data.country_code),
            mobileNo: CommonHelper.number(this.data.mobile_number),
            email: CommonHelper.text(this.data.email),

            roleId: CommonHelper.number(this.data.role),
            role: CommonHelper.text(CommonHelper.getRoleName(this.data.role)),

            managerId: CommonHelper.number(this.data.manager_id),
            manager: CommonHelper.text(CommonHelper.capitalizeWords(this.data.manager?.name)),

            isActive: CommonHelper.bool(this.data.is_active),
            isMobileVerified: CommonHelper.bool(this.data.is_mobile_verified),
            isEmailVerified: CommonHelper.bool(this.data.is_email_verified),
            createdAt: CommonHelper.dateTime(this.data.created_at),
            createdBy: CommonHelper.number(this.data.created_by),
            createdByName: CommonHelper.text(this.data.createdByUser?.name),

            updatedAt: CommonHelper.dateTime(this.data.updated_at),
            updatedBy: CommonHelper.number(this.data.updated_by),
            updatedByName: CommonHelper.text(this.data.updatedByUser?.name),
        };
    }
}
