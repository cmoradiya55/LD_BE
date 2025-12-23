import { FuelTypeLabel, TransmissionTypeLabel } from '@common/enums/car-detail.enum';
import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class MyUsedCarListingResource extends BaseResource<any> {
    toJSON() {
        return {
            id: CommonHelper.number(this.data.id),
            image: CommonHelper.buildImageUrl(this.data?.primaryImage),
            slug: CommonHelper.text(this.data.slug),
            displayName: CommonHelper.text(`${this.data?.brandName} ${this.data?.modelName}`),
            areaName: CommonHelper.text(CommonHelper.capitalizeWords(this.data.areaName)),
            cityName: CommonHelper.text(CommonHelper.capitalizeWords(this.data.cityName)),
            registrationYear: CommonHelper.number(this.data.registrationYear),
            variantName: CommonHelper.text(this.data?.variantName),
            ownerType: CommonHelper.number(this.data.ownerType),
            kmDriven: CommonHelper.number(this.data.kmDriven),
            fuelType: CommonHelper.text(FuelTypeLabel[this.data.fuelType] || 'Other'),
            transmissionType: CommonHelper.text(TransmissionTypeLabel[this.data.transmissionType] || 'Other'),
            price: CommonHelper.currency(this.data.finalPrice),
            isWishlisted: CommonHelper.bool(this.data?.isWishlisted),
            status: CommonHelper.number(this.data.status),
            statusLabel: CommonHelper.text(CommonHelper.getCarListingsStatusName(this.data.status)),
        };
    }
}
