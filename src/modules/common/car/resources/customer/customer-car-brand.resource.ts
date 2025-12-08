import { CommonHelper } from "@common/helpers/common.helper";
import { BaseResource } from "@common/utils/resource.utils";
import { CarBrand } from "@entity/car/car-brand.entity";

export class CustomerCarBrandResource extends BaseResource<CarBrand> {
  toJSON() {
    return {
      id: CommonHelper.number(this.data.id),
      displayName: CommonHelper.text(this.data.display_name),
      logo: CommonHelper.buildImageUrl(this.data.logo_url),
    };
  }
}