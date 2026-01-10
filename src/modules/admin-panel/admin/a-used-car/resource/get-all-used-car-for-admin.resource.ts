import { FuelTypeLabel, TransmissionTypeLabel } from '@common/enums/car-detail.enum';
import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class GetAllUsedCarsForAdminResource extends BaseResource<any> {
    toJSON() {
        const car = this.data;

        return {
            id: CommonHelper.number(car.id),
            imageUrl: CommonHelper.buildImageUrl(car.primaryImage),
            slug: CommonHelper.text(car.slug),

            displayName: CommonHelper.text(`${car.brandName} ${car?.modelName}`),
            variant: CommonHelper.text(car.variantName),

            fuelType: CommonHelper.text(FuelTypeLabel[car.fuelType]),
            transmissionType: CommonHelper.text(TransmissionTypeLabel[car.transmissionType]),

            registrationNumber: CommonHelper.text(car.registrationNumber),
            rtoCode: CommonHelper.text(car.rtoCode),

            kmDriven: CommonHelper.number(car.kmDriven),

            ownerType: CommonHelper.number(car.ownerType),
            customerKmDrivenRange: CommonHelper.number(car.kmDrivenRange),
            customerExpectedPrice: CommonHelper.number(car.customerExpectedPrice),
            finalPrice: CommonHelper.number(car.finalPrice),
            managerSuggestedPrice: CommonHelper.number(car.managerSuggestedPrice),

            rcImage: CommonHelper.buildImageUrl(car.rcImage),
            insuranceImage: CommonHelper.buildImageUrl(car.insuranceImage),

            customerId: CommonHelper.number(car.customerId),
            customerName: CommonHelper.text(car.customerName),

            areaName: CommonHelper.text(car.areaName),
            cityName: CommonHelper.capitalizeWords(car.cityName),
        };
    }
}