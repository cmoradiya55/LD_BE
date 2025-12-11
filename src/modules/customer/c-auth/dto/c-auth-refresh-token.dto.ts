import { IsString } from 'class-validator';

export class CAuthRefreshTokenDto {
    @IsString()
    device_id: string;
}