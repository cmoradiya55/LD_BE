import { CommonHelper } from '@common/helpers/common.helper';
import { BaseResource } from '@common/utils/resource.utils';

export class RefreshAccessTokenResource extends BaseResource<any> {
    toJSON() {
        return {
            accessToken: CommonHelper.text(this.data.accessToken),
            expiresInMs: CommonHelper.number(this.data.expiresInMs),
        };
    }
}
