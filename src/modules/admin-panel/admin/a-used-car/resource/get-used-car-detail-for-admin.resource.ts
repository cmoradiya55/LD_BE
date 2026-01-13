import { FuelTypeLabel, TransmissionTypeLabel } from '@common/enums/car-detail.enum';
import { CommonHelper } from '@common/helpers/common.helper';
import { InspectionImageSubType, InspectionImageType } from '@common/providers/inspection-image/enum/inspection-image.enum';
import { BaseResource } from '@common/utils/resource.utils';


export class InspectionReportImageAdminResource extends BaseResource<any> {
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

        if (this.data.image_type === InspectionImageType.TYRES) {
            data['treadDepth'] = CommonHelper.number(this.data.tread_depth);
        }

        if (
            this.data.image_type === InspectionImageType.ELECTRICAL
            &&
            (this.data.image_subtype === InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_FRONT_WINDOW ||
                this.data.image_subtype === InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_REAR_WINDOW ||
                this.data.image_subtype === InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_FRONT_WINDOW ||
                this.data.image_subtype === InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_REAR_WINDOW)
        ) {
            data['isPower'] = CommonHelper.bool(this.data.is_power);
        }

        return data;
    }
}

class CustomerPhotosAdminResource extends BaseResource<any> {
    toJSON() {
        const photos = this.data;

        return {
            id: CommonHelper.number(photos.id),
            url: CommonHelper.buildImageUrl(photos.url),
        };
    }
}


export class GetUsedCarDetailForAdminResource extends BaseResource<any> {
    toJSON() {
        console.log(this.data);
        const car = this.data;

        const brand = this.data?.brand;
        const model = this.data?.model;
        const variant = this.data?.variant;

        const pincode = this.data?.pincode;
        const city = pincode?.city;

        const customerPhotos = this.data?.photos;
        const inspectionImages = this.data?.inspectionImages;

        return {
            id: CommonHelper.number(car.id),
            slug: CommonHelper.text(car.slug),
            registrationNumber: CommonHelper.text(car.registration_number),
            registrationNumberClean: CommonHelper.text(car.registration_number_clean),
            rtoCode: CommonHelper.text(car.rto_code),
            
            kmDriven: CommonHelper.number(car.km_driven),

            owner: CommonHelper.number(car.owner_type),
            customerKmDrivenRange: CommonHelper.number(car.km_driven_range),
            customerExpectedPrice: CommonHelper.number(car.expected_price),
            managerSuggestedPrice: CommonHelper.number(car.manager_suggested_price),
            finalPrice: CommonHelper.number(car.final_price),

            rcImage: CommonHelper.buildImageUrl(car.rc_image),
            insuranceImage: CommonHelper.buildImageUrl(car.insurance_image),

            customer_id: CommonHelper.number(car.customer_id),
            brand: CommonHelper.text(brand.display_name),
            model: CommonHelper.text(model.display_name),
            variant: CommonHelper.text(variant.display_name),

            fuelType: CommonHelper.number(car.fuel_type),
            fuelTypeLabel: CommonHelper.text(FuelTypeLabel[car.fuel_type]),

            transmissionType: CommonHelper.number(car.transmission_type),
            transmissionTypeLabel: CommonHelper.text(TransmissionTypeLabel[car.transmission_type]),
            exShowroomPrice: CommonHelper.number(car.ex_showroom_price),

            address: {
                pincode: CommonHelper.text(pincode?.pincode),
                areaName: CommonHelper.text(pincode?.area_name),
                cityName: CommonHelper.capitalizeWords(city?.city_name),
            },

            staffReport: {
                registartionDate: CommonHelper.text(this.data.registration_date),
                fitnessValidUntil: CommonHelper.text(this.data.fitness_valid_until),
                insuranceValidUntil: CommonHelper.text(this.data.insurance_valid_until),
                pucValidUntil: CommonHelper.text(this.data.puc_valid_until),
                challanDetails: this.data.challan_details,
                loanStatus: CommonHelper.text(this.data.loan_status),
                owner: CommonHelper.text(this.data.owner),

                registrationPlace: CommonHelper.text(this.data.registration_place),
                isBlacklisted: CommonHelper.bool(this.data.is_blacklisted),
                isRtoNocIssued: CommonHelper.bool(this.data.is_rto_noc_issued),
                isPartyPeshi: CommonHelper.bool(this.data.is_party_peshi),
                isHypothecated: CommonHelper.bool(this.data.is_hypothecated),
                isConverted: CommonHelper.bool(this.data.is_converted),
                isMigrated: CommonHelper.bool(this.data.is_migrated),
                adaptedForSpecialUse: CommonHelper.bool(this.data.adapted_for_special_use),
                criminalCases: CommonHelper.number(this.data.criminal_cases),
                civilCases: CommonHelper.number(this.data.civil_cases),
                roadAccidents: CommonHelper.number(this.data.road_accidents),
                compensationCases: CommonHelper.number(this.data.compensation_cases),
                otherCases: CommonHelper.number(this.data.other_cases),
                staffRemarks: CommonHelper.text(this.data.staff_remarks),
            },

            customerPhotos: CustomerPhotosAdminResource.collection(customerPhotos),
            inspectionImages: InspectionReportImageAdminResource.collection(inspectionImages),

        };
    }
}
