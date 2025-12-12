import { IsDeviceId } from '@common/decorators/is-device-id.decorator';
import { IsString } from 'class-validator';

export class CAuthRefreshTokenDto {
    @IsDeviceId()
    device_id: string;
}