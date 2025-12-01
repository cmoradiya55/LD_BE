import { BaseResource } from '@common/utils/resource.utils';
import { Pincode } from '@entity/general/pincode.entity';

export class PincodeCitySuggestionResource extends BaseResource<Pincode> {

    private toTitle(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    toJSON() {
        return {
            pincode_id: this.data.id,
            city_id: this.data.city.id,
            is_active: this.data.city.is_active,
            formatted: `${this.data.pincode}, ${this.data.area_name}, ${this.toTitle(this.data.city.city_name)}, ${this.toTitle(this.data.city.state_name)}`
        };
    }
}
