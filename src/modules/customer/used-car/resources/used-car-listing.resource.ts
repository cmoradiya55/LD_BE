import { FuelTypeLabel, TransmissionTypeLabel } from '@common/enums/car-detail.enum';
import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class UsedCarListingResource extends BaseResource<any> {
    toJSON() {
        return {
            id: CommonHelper.number(this.data.id),
            image: CommonHelper.buildImageUrl(this.data?.primaryImage),
            slug: CommonHelper.text(this.data.slug),
            displayName: CommonHelper.text(`${this.data.registrationYear} ${this.data?.brandName} ${this.data?.modelName}`),
            variantName: CommonHelper.text(this.data?.variantName),
            kmDriven: CommonHelper.number(this.data.kmDriven),
            fuelType: CommonHelper.text(FuelTypeLabel[this.data.fuelType] || 'Other'),
            transmissionType: CommonHelper.text(TransmissionTypeLabel[this.data.transmissionType] || 'Other'),
            price: CommonHelper.currency(this.data.finalPrice),
            rto: CommonHelper.text(this.data.rtoCode),
            isWishlisted: CommonHelper.bool(this.data?.isWishlisted),
        };
    }
}
