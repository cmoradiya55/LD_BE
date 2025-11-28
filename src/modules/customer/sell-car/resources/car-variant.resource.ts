// src/common/resources/car-variant.resource.ts

import { FuelTypeLabel, TransmissionTypeLabel } from "@common/enums/car-detail.enum";
import { BaseResource } from "@common/utils/resource.utils";
import { CarVariant } from "@entity/car/car-variant.entity";


interface CarVariantResponse {
  id: number;
  name: string;
  displayName: string;
  transmissionType: string;
  transmissionTypeId: number;
  fuelType: string;
  fuelTypeId: number;
  modelYear: number;
}

export class CarVariantResource extends BaseResource<CarVariant, CarVariantResponse> {
  toJSON(): CarVariantResponse {
    return {
      id: this.data.id,
      name: this.data.name,
      displayName: this.data.display_name,
      transmissionType: TransmissionTypeLabel[this.data.transmission_type] || 'Other',
      transmissionTypeId: this.data.transmission_type,
      fuelType: FuelTypeLabel[this.data.fuel_type] || 'Other',
      fuelTypeId: this.data.fuel_type,
      modelYear: this.data.model_year,
    };
  }
}