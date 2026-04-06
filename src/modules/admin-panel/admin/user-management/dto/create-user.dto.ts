import { UserRole } from '@common/enums/user.enum';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsPositive,
    IsString,
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

    // Inspection Centre is required if role !== ADMIN or MANAGER
    @ValidateIf(dto => dto.roleId === UserRole.MANAGER)
    @IsNotEmpty({ message: 'Inspection Centre is required for this role' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    inspectionCentreId: number;

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
