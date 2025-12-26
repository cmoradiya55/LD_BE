import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class GetAllInspectorResource extends BaseResource<any> {
    toJSON() {
        return {
            id: CommonHelper.number(this.data.id),
            selfie_image: CommonHelper.buildImageUrl(this.data.selfie_image),
            name: CommonHelper.text(this.data.name),
            countryCode: CommonHelper.number(this.data.country_code),
            mobileNo: CommonHelper.number(this.data.mobile_number),
            email: CommonHelper.text(this.data.email),


            documentStatus: CommonHelper.text(this.data.document_status),
            documentStatusName: CommonHelper.getUserDocumentStatusName(this.data.document_status),
            remarks: CommonHelper.text(this.data.remarks),
            selfieImage: CommonHelper.buildImageUrl(this.data.selfie_image),
            aadharFrontImage: CommonHelper.buildImageUrl(this.data.aadhar_front_image),
            aadharBackImage: CommonHelper.buildImageUrl(this.data.aadhar_back_image),
            panImage: CommonHelper.buildImageUrl(this.data.pan_image),
            aadharNumber: CommonHelper.text(this.data.aadhar_number),
            panNumber: CommonHelper.text(this.data.pan_number),

            roleId: CommonHelper.number(this.data.role),
            role: CommonHelper.text(CommonHelper.getRoleName(this.data.role)),

            managerId: CommonHelper.number(this.data.manager_id),
            manager: CommonHelper.text(CommonHelper.capitalizeWords(this.data.manager?.name)),

            isActive: CommonHelper.bool(this.data.is_active),
            isMobileVerified: CommonHelper.bool(this.data.is_mobile_verified),
            isEmailVerified: CommonHelper.bool(this.data.is_email_verified),
            createdAt: CommonHelper.dateTime(this.data.created_at),
            createdBy: CommonHelper.number(this.data.created_by),
            createdByName: CommonHelper.text(this.data.createdByUser?.name),

            updatedAt: CommonHelper.dateTime(this.data.updated_at),
            updatedBy: CommonHelper.number(this.data.updated_by),
            updatedByName: CommonHelper.text(this.data.updatedByUser?.name),
        };
    }
}
