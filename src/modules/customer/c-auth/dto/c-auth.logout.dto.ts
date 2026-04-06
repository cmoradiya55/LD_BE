import { IsString } from 'class-validator';

export class CAuthLogoutDto {
    @IsString()
    deviceId: string;
}