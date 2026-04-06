import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class UploadUrlResource extends BaseResource<any> {
    toJSON() {
        return {
            originalName: CommonHelper.text(this.data.originalName),
            uploadUrl: CommonHelper.text(this.data.uploadUrl),
            key: CommonHelper.text(this.data.key),
            keyWithBaseUrl: CommonHelper.buildImageUrl(this.data.key),
            contentType: CommonHelper.text(this.data.contentType),
        };
    }
}
