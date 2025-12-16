import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';
import { City } from '@entity/general/city.entity';

export class ActiveCityResource extends BaseResource<City> {
    toJSON() {
        return {
            id: CommonHelper.number(this.data.id),
            stateName: CommonHelper.text(CommonHelper.capitalizeWords(this.data.state_name)),
            cityName: CommonHelper.text(CommonHelper.capitalizeWords(this.data.city_name)),
        };
    }
}
