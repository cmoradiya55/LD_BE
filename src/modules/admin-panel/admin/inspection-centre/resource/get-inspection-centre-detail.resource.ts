import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';


export class InspectionCentreManagerResource extends BaseResource<any> {
    toJSON() {
        const manager = this.data;

        return {
            id: CommonHelper.number(manager.id),
            name: CommonHelper.text(manager.name),
            countryCode: CommonHelper.number(manager.country_code),
            mobileNumber: CommonHelper.number(manager.mobile_number),
            email: CommonHelper.text(manager.email),
            isActive: CommonHelper.bool(manager.is_active),
        };
    }
}


export class GetInspectionCentreDetailResource extends BaseResource<any> {
    toJSON() {
        const inspectionCentre = this.data?.inspectionCentres.length > 0 ? this.data.inspectionCentres[0] : null;
        const pincode = this.data.pincode;
        const city = this.data;
        const inspectionCentrePincode = inspectionCentre?.pincode;

        return {
            id: CommonHelper.number(city.id),
            stateName: CommonHelper.text(CommonHelper.capitalizeWords(city.state_name)),
            cityName: CommonHelper.text(CommonHelper.capitalizeWords(city.city_name)),
            isActive: CommonHelper.bool(city.is_active),
            inspectionCentre: {
                id: CommonHelper.number(inspectionCentre ? inspectionCentre.id : null),
                address: CommonHelper.text(inspectionCentre ? inspectionCentre.address : null),
                landmark: CommonHelper.text(inspectionCentre ? inspectionCentre.landmark : null),
                pincode: CommonHelper.text(inspectionCentrePincode ? inspectionCentrePincode.pincode : null),
                isActive: CommonHelper.bool(inspectionCentre ? inspectionCentre.is_active : null),
            },
            managers: InspectionCentreManagerResource.collection(inspectionCentre ? inspectionCentre.users : []),
        };
    }
}
