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
            registrationYear: CommonHelper.number(car.registration_year),

            status: CommonHelper.number(car.status),
            statusLabel: CommonHelper.getCarListingsStatusName(car.status),
            adminCancelReason: CommonHelper.text(car.cancel_reason),

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
                registartionDate: CommonHelper.text(car.registration_date),
                fitnessValidUntil: CommonHelper.text(car.fitness_valid_until),
                insuranceValidUntil: CommonHelper.text(car.insurance_valid_until),
                pucValidUntil: CommonHelper.text(car.puc_valid_until),
                challanDetails: car.challan_details,
                loanStatus: CommonHelper.text(car.loan_status),
                owner: CommonHelper.text(car.owner),

                registrationPlace: CommonHelper.text(car.registration_place),
                isBlacklisted: CommonHelper.bool(car.is_blacklisted),
                isRtoNocIssued: CommonHelper.bool(car.is_rto_noc_issued),
                isPartyPeshi: CommonHelper.bool(car.is_party_peshi),
                isHypothecated: CommonHelper.bool(car.is_hypothecated),
                isConverted: CommonHelper.bool(car.is_converted),
                isMigrated: CommonHelper.bool(car.is_migrated),
                adaptedForSpecialUse: CommonHelper.bool(car.adapted_for_special_use),
                criminalCases: CommonHelper.number(car.criminal_cases),
                civilCases: CommonHelper.number(car.civil_cases),
                roadAccidents: CommonHelper.number(car.road_accidents),
                compensationCases: CommonHelper.number(car.compensation_cases),
                otherCases: CommonHelper.number(car.other_cases),
                staffRemarks: CommonHelper.text(car.staff_remarks),
            },

            customerPhotos: CustomerPhotosAdminResource.collection(customerPhotos),
            inspectionImages: InspectionReportImageAdminResource.collection(inspectionImages),

        };
    }
}
