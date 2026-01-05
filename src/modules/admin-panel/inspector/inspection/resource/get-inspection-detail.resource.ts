import { FuelTypeLabel } from '@common/enums/car-detail.enum';
import { CommonHelper } from '@common/helpers/common.helper';
import { InspectionImageSubType, InspectionImageType } from '@common/providers/inspection-image/enum/inspection-image.enum';
import { BaseResource } from '@common/utils/resource.utils';


export class InspectionImageResource extends BaseResource<any> {
    toJSON() {
        const data = {
            id: CommonHelper.number(this.data.id),
            type: CommonHelper.number(this.data.image_type),
            subType: CommonHelper.number(this.data.image_subtype),
            imageUrl: CommonHelper.buildImageUrl(this.data.image_url),

            title: CommonHelper.text(this.data.title),

            isDamage: CommonHelper.bool(this.data.has_damage),
            remarks: CommonHelper.text(this.data.remarks)
        };

        if (this.data.type === InspectionImageType.TYRES) {
            data['treadDepth'] = CommonHelper.number(this.data.tread_depth);
        }

        if (this.data.sub_type === InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_FRONT_WINDOW ||
            this.data.sub_type === InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_REAR_WINDOW ||
            this.data.sub_type === InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_FRONT_WINDOW ||
            this.data.sub_type === InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_REAR_WINDOW) {
            data['isPower'] = CommonHelper.number(this.data.is_power);
        }

        return data;
    }
}

export class GetInspectionDetailResource extends BaseResource<any> {
    toJSON() {

        const brand = this.data?.brand;
        const model = this.data?.model;
        const variant = this.data?.variant;
        const pincode = this.data?.pincode;
        const city = pincode?.city;
        const inspectionImages = this.data?.inspectionImages;


        return {
            id: CommonHelper.number(this.data.id),
            status: CommonHelper.number(this.data.status),
            statusLabel: CommonHelper.getCarListingsStatusName(this.data.status),

            rc_image: CommonHelper.buildImageUrl(this.data.rc_image),
            insurance_image: CommonHelper.buildImageUrl(this.data.insurance_image),

            car: {
                brand: CommonHelper.text(brand?.display_name),
                model: CommonHelper.text(model?.display_name),
                variant: CommonHelper.text(variant?.display_name),
                modelYear: CommonHelper.number(variant?.model_year),

                fuelType: CommonHelper.number(variant?.fuel_type),
                fuelTypeLabel: CommonHelper.text(FuelTypeLabel[variant?.fuel_type]),

                registrationYear: CommonHelper.number(this.data.registration_year),
                registrationNumber: CommonHelper.text(this.data.registration_number),
                ownerType: CommonHelper.number(this.data.owner_type),
                kmDrivenRange: CommonHelper.number(this.data.km_driven_range),
            },

            customer: {
                id: CommonHelper.number(this.data.customer?.id),
                fullName: CommonHelper.text(this.data.customer?.full_name),
                countryCode: CommonHelper.number(this.data.customer?.mobile_country_code),
                mobileNo: CommonHelper.number(this.data.customer?.mobile_no),
                pincode: CommonHelper.number(pincode?.pincode),
                areaName: CommonHelper.text(pincode?.area_name),
                city: CommonHelper.capitalizeWords(city?.city_name),
                state: CommonHelper.capitalizeWords(city?.state_name),
            },

            inspection: {
                kmDriven: CommonHelper.number(this.data.km_driven),
            },
            inspectionImages: InspectionImageResource.collection(inspectionImages),
        };
    }
}
