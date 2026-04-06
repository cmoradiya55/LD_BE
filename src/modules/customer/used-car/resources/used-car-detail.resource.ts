import { FeatureValueType, FuelTypeLabel, TransmissionTypeLabel } from '@common/enums/car-detail.enum';
import { CommonHelper } from '@common/helpers/common.helper';
import { IMAGE_TYPE_NAMES } from '@common/providers/inspection-image/enum/inspection-image.enum';
import { BaseResource } from '@common/utils/resource.utils';


class UsedCarFeatureResource extends BaseResource<any> {
    toJSON() {
        const valueType = this.data.feature?.value_type;
        let featureValue: any = null;

        if (valueType === FeatureValueType.BOOLEAN) {
            featureValue = CommonHelper.bool(this.data.feature_value);
        } else if (valueType === FeatureValueType.NUMBER) {
            featureValue = CommonHelper.number(this.data.feature_value);
        } else {
            featureValue = CommonHelper.text(this.data.feature_value);
        }

        return {
            id: CommonHelper.number(this.data.feature_id),
            name: CommonHelper.text(this.data.feature?.name),
            displayName: CommonHelper.text(this.data.feature?.display_name),
            valueType: valueType,
            featureValue: featureValue,
        };
    }
}

export class UsedCarDetailResource extends BaseResource<any> {
    toJSON() {
        const data = this.data;
        const brand = this.data?.brand;
        const model = this.data?.model;
        const variant = this.data?.variant;
        const variantFeatures = variant?.variantFeatures || [];

        console.log('data', data);

        return {
            id: CommonHelper.number(data.id),
            displayName: CommonHelper.text(`${brand?.display_name} ${model?.display_name}`),
            variantName: CommonHelper.text(variant?.display_name),
            registrationYear: CommonHelper.number(data.registration_year),
            kmDriven: CommonHelper.number(data.km_driven),
            registrationNumber: CommonHelper.maskRegistrationNumber(data.registration_number),
            ownerType: data.owner_type,
            rtoCode: CommonHelper.text(data.rto_code),

            final_price: data.final_price,

            transmissionType: TransmissionTypeLabel[variant.transmission_type] || 'Other',
            transmissionTypeId: variant.transmission_type,

            bootSpaceLiters: CommonHelper.number(variant.boot_space_liters),
            seatingCapacity: CommonHelper.number(variant.seating_capacity),
            groundClearanceMm: CommonHelper.number(variant.ground_clearance_mm),

            // engine specs
            fuelType: FuelTypeLabel[variant.fuel_type] || 'Other',
            fuelTypeId: CommonHelper.number(variant.fuel_type),

            displacementCc: CommonHelper.number(variant.engine_displacement_cc),
            cylinders: CommonHelper.number(variant.cylinders),
            powerBhp: CommonHelper.number(variant.max_power_ps),
            powerRpm: CommonHelper.number(variant.max_power_rpm),
            torqueNm: CommonHelper.number(variant.max_torque_nm),
            fuelTankCapacityLiters: CommonHelper.number(variant.fuel_tank_liters),
            mileageKmpl: CommonHelper.number(variant.mileage_kmpl),
            batteryCapacityKwh: CommonHelper.number(variant.battery_capacity_kwh),
            electricRangeKm: CommonHelper.number(variant.electric_range_km),
            electricMotorPowerKw: CommonHelper.number(variant.electric_motor_power_kw),
            electricMotorTorqueNm: CommonHelper.number(variant.electric_motor_torque_nm),

            numberOfGears: CommonHelper.number(variant.num_gears),

            isWishlisted: CommonHelper.bool(this.data?.isWishlisted),

            // Features
            features: UsedCarFeatureResource.collection(variantFeatures),

            // Group images by type
            images: this.groupImagesByType(data.images || []),
        };
    }

    /**
     * Group images by image_type
     */
    private groupImagesByType(images: any[]) {
        const grouped = images.reduce((acc, image) => {
            const type = image.image_type;

            if (!acc[type]) {
                acc[type] = {
                    type: type,
                    typeName: IMAGE_TYPE_NAMES[type] || 'Other',
                    images: [],
                };
            }

            acc[type].images.push({
                id: image.id,
                imageSubtype: image.image_subtype,
                imageUrl: image.image_url,
                title: image.title,
            });

            return acc;
        }, {});

        // Convert to array and sort by type
        // return Object.values(grouped).sort((a: any, b: any) => a.type - b.type);
        return Object.values(grouped);
    }
}
