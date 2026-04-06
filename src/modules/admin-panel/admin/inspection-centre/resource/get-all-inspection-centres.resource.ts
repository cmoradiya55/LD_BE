import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class GetAllInspectionCentresResource extends BaseResource<any> {
    toJSON() {
        const pincode = this.data.pincode;
        const city = this.data.city;

        return {
            id: CommonHelper.number(this.data.id),
            address: CommonHelper.text(this.data.address),
            landmark: CommonHelper.text(this.data.landmark),
            pincode: CommonHelper.text(pincode ? pincode.pincode : null),
            cityName: CommonHelper.text(city ? CommonHelper.capitalizeWords(city.city_name) : null),
            stateName: CommonHelper.text(city ? CommonHelper.capitalizeWords(city.state_name) : null),

            createdAt: CommonHelper.dateTime(this.data.created_at),
            createdBy: CommonHelper.number(this.data.created_by),
            createdByName: CommonHelper.text(this.data.createdByUser?.name),

            updatedAt: CommonHelper.dateTime(this.data.updated_at),
            updatedBy: CommonHelper.number(this.data.updated_by),
            updatedByName: CommonHelper.text(this.data.updatedByUser?.name),
        };
    }
}
