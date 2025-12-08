import { CommonHelper } from "@common/helpers/common.helper";
import { BaseResource } from "@common/utils/resource.utils";
import { CarBrand } from "@entity/car/car-brand.entity";
import { CarModel } from "@entity/car/car-model.entity";

export class CustomerCarModelSearchResource extends BaseResource<CarModel> {
  toJSON() {
    return {
      id: CommonHelper.number(this.data.id),
      displayName: CommonHelper.text(`${this.data.brand.display_name} ${this.data.display_name}`),
      logo: CommonHelper.buildImageUrl(this.data.brand.logo_url),
    };
  }
}