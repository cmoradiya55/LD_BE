import { FuelTypeLabel } from "@common/enums/car-detail.enum";
import { BaseResource } from "@common/utils/resource.utils";
import { CarVariant } from "@entity/car/car-variant.entity";
import { CarVariantResource } from "./car-variant.resource";

interface CustomerFuelTypeGroup {
    fuelType: string;
    fuelTypeId: number;
    variants: CarVariant[];
}

interface CustomerFuelTypeGroupResponse {
    fuelType: string;
    fuelTypeId: number;
    variants: ReturnType<CarVariantResource['toJSON']>[];
}

export class CustomerFuelTypeGroupResource extends BaseResource<CustomerFuelTypeGroup, CustomerFuelTypeGroupResponse> {
    toJSON(): CustomerFuelTypeGroupResponse {
        return {
            fuelType: this.data.fuelType,
            fuelTypeId: this.data.fuelTypeId,
            variants: CarVariantResource.collection(this.data.variants),
        };
    }

    // Static method to transform grouped data from repository
    static fromGroupedVariants(variants: CarVariant[]): CustomerFuelTypeGroupResponse[] {
        const groupedMap = new Map<number, CarVariant[]>();

        variants.forEach((variant) => {
            const existing = groupedMap.get(variant.fuel_type) || [];
            existing.push(variant);
            groupedMap.set(variant.fuel_type, existing);
        });

        return Array.from(groupedMap.entries()).map(([fuelTypeId, variants]) => {
            const group: CustomerFuelTypeGroup = {
                fuelType: FuelTypeLabel[fuelTypeId] || 'Other',
                fuelTypeId,
                variants,
            };
            return new CustomerFuelTypeGroupResource(group).toJSON();
        });
    }
}