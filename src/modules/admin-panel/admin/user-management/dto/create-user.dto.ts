import { UserRole } from '@common/enums/user.enum';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Matches,
    Max,
    Min,
    ValidateIf,
} from 'class-validator';

export class AdminCreateUserDto {
    @IsEnum(UserRole)
    roleId: UserRole;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(1)
    @Max(999)
    @Type(() => Number)
    countryCode: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    mobileNo: number;

    // city is required if role !== ADMIN
    @ValidateIf(dto => dto.roleId !== UserRole.ADMIN)
    @IsNotEmpty({ message: 'City is required for this role' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    cityId: number;

    // managerId required if role is INSPECTOR or STAFF
    @ValidateIf(dto =>
        dto.roleId === UserRole.INSPECTOR ||
        dto.roleId === UserRole.STAFF
    )
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    managerId: number;
}
