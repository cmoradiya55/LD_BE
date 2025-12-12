import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';
import { Pincode } from '@entity/general/pincode.entity';

export class PincodeCitySuggestionResource extends BaseResource<Pincode> {

    private toTitle(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    toJSON() {
        return {
            formatted: CommonHelper.text(`${this.data.pincode}, ${this.data.area_name}, ${this.toTitle(this.data.city.city_name)}, ${this.toTitle(this.data.city.state_name)}`),
            is_active: CommonHelper.bool(this.data.city.is_active),
            city_id: CommonHelper.number(this.data.city.id),
            city: CommonHelper.text(this.toTitle(this.data.city.city_name)),
            pincode_id: CommonHelper.number(this.data.id),
            pincode: CommonHelper.number(this.data.pincode),
            area_name: CommonHelper.text(this.data.area_name),
        };
    }
}
