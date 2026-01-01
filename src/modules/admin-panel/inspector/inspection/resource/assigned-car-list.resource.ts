import { FuelTypeLabel, TransmissionTypeLabel, UsedCarListingStatus } from '@common/enums/car-detail.enum';
import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

class CustomerPhotosResource extends BaseResource<any> {
    toJSON() {
        const photos = this.data;

        return {
            id: CommonHelper.number(photos.id),
            url: CommonHelper.buildImageUrl(photos.url),
        };
    }
}

class InspectionImagesResource extends BaseResource<any> {
    toJSON() {
        const photos = this.data;

        return {
            id: CommonHelper.number(photos.id),
            type: CommonHelper.number(photos.image_type),
            subtype: CommonHelper.number(photos.image_subtype),
            title: CommonHelper.text(photos.title),
            remarks: CommonHelper.text(photos.remarks),
            hasDamage: CommonHelper.bool(photos.has_damage),
            sortOrder: CommonHelper.number(photos.sort_order),
            isActive: CommonHelper.bool(photos.is_active),
            url: CommonHelper.buildImageUrl(photos.image_url),
        };
    }
}

export class AssignedCarListingResource extends BaseResource<any> {
    toJSON() {
        const brand = this.data.brand;
        const model = this.data.model;
        const variant = this.data.variant;

        const pincode = this.data.pincode;
        const city = pincode?.city;

        const customerPhotos = this.data.photos;
        const inspectionImages = this.data.inspectionImages;

        return {
            id: CommonHelper.number(this.data.id),
            slug: CommonHelper.text(this.data.slug),

            displayName: CommonHelper.text(`${brand?.display_name} ${model?.display_name}`),
            variantName: CommonHelper.text(variant?.display_name),

            ownerType: CommonHelper.number(this.data.owner_type),

            areaName: CommonHelper.text(CommonHelper.capitalizeWords(pincode?.area_name)),
            cityName: CommonHelper.text(CommonHelper.capitalizeWords(city?.city_name)),

            registrationYear: CommonHelper.number(this.data.registration_year),
            registrationNumber: CommonHelper.text(this.data.registration_number),

            kmDriven: CommonHelper.number(this.data.km_driven_range),
            inspectedKmDriven: CommonHelper.number(this.data.km_driven),
            fuelType: CommonHelper.text(FuelTypeLabel[variant.fuel_type] || 'Other'),
            transmissionType: CommonHelper.text(TransmissionTypeLabel[variant.transmission_type] || 'Other'),
            customerExpectedPrice: CommonHelper.currency(this.data.expected_price),
            linkDrivePrice: CommonHelper.currency(this.data.final_price),
            status: CommonHelper.number(this.data.status),
            statusLabel: CommonHelper.getCarListingsStatusName(this.data.status),
            customerPhotos: CustomerPhotosResource.collection(customerPhotos || []),
            inspectionImages: InspectionImagesResource.collection(inspectionImages || []),
        };
    }
}
