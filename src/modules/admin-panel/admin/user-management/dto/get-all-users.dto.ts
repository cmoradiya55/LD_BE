import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { UserDocumentVerificationStatus } from "@common/enums/user.enum";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class GetAllUsersDto extends PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNotEmpty()
    @IsEnum(UserDocumentVerificationStatus)
    documentStatus?: UserDocumentVerificationStatus;
}