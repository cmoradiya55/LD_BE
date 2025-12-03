import { BaseResource } from '@common/utils/resource.utils';
import { Pincode } from '@entity/general/pincode.entity';

export class PincodeCitySuggestionResource extends BaseResource<Pincode> {

    private toTitle(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    toJSON() {
        return {
            formatted: `${this.data.pincode}, ${this.data.area_name}, ${this.toTitle(this.data.city.city_name)}, ${this.toTitle(this.data.city.state_name)}`,
            is_active: this.data.city.is_active,
            city_id: this.data.city.id,
            city: this.toTitle(this.data.city.city_name),
            pincode_id: this.data.id,
            pincode: this.data.pincode,
            area_name: this.data.area_name,
        };
    }
}
