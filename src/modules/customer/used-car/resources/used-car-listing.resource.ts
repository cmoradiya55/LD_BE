import { FuelTypeLabel, TransmissionTypeLabel } from '@common/enums/car-detail.enum';
import { BaseResource } from '@common/utils/resource.utils';

export class UsedCarListingResource extends BaseResource<any> {

    private toTitle(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }


    toJSON() {
        const tempImage = 'https://imgs.search.brave.com/gSButd9RGxlyxvi5LvHri38wFFgH-3FtwLzsjzZlGRc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YXV0b3Zpc3RhLmlu/L2Fzc2V0cy9wcm9k/dWN0X2ltYWdlcy9n/YWxsZXJ5L25ldy1i/YWxlbm8tZnJvbnQu/anBn';
        return {
            id: this.data.id,
            image: tempImage,
            slug: this.data.slug,
            displayName: `${this.data.registrationYear} ${this.data?.brandName} ${this.data?.modelName}`,
            variantName: this.data?.variantName,
            kmDriven: this.data.kmDriven,
            fuelType: FuelTypeLabel[this.data.fuelType] || 'Other',
            transmissionType: TransmissionTypeLabel[this.data.transmissionType] || 'Other',
            price: this.data.finalPrice,
            rto: this.data.rtoCode,
        };
    }
}
