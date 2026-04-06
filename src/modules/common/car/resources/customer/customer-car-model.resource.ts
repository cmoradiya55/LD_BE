import { CommonHelper } from "@common/helpers/common.helper";
import { BaseResource } from "@common/utils/resource.utils";
import { CarModel } from "@entity/car/car-model.entity";

export class CustomerCarModelFilterListingResource extends BaseResource<CarModel> {
  toJSON() {
    return {
      id: CommonHelper.number(this.data.id),
      displayName: CommonHelper.text(this.data.display_name),
    };
  }
}


export class CustomerCarModelResource extends BaseResource<CarModel> {
  toJSON() {
    return {
      id: CommonHelper.number(this.data.id),
      displayName: CommonHelper.text(this.data.display_name),
      name: CommonHelper.text(this.data.name),
    };
  }
}