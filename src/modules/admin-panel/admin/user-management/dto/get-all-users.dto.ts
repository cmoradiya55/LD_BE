import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { UserDocumentVerificationStatus, UserRole } from "@common/enums/user.enum";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class GetAllUsersDto extends PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNotEmpty()
    @IsEnum(UserDocumentVerificationStatus)
    documentStatus?: UserDocumentVerificationStatus;

    @IsOptional()
    @Type(() => Number)
    @IsIn([
        UserRole.MANAGER,
        UserRole.INSPECTOR,
        UserRole.STAFF
    ])
    role?: number;
}