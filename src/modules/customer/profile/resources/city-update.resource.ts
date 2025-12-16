import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';
import { City } from '@entity/general/city.entity';

export class CityUpdateResource extends BaseResource<City> {
    toJSON() {
        return {
            cityId: CommonHelper.number(this.data.id),
            cityName: CommonHelper.text(CommonHelper.capitalizeWords(this.data.city_name)),
            stateName: CommonHelper.text(CommonHelper.capitalizeWords(this.data.state_name)),
        };
    }
}
