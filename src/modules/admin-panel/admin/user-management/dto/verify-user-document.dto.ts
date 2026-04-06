import { UserDocumentVerificationStatus } from "@common/enums/user.enum";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsPositive, MinLength, ValidateIf } from "class-validator";

export class VerifyUserDocumentsDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    userId: number;

    @IsNotEmpty()
    @IsIn(
        [
            UserDocumentVerificationStatus.VERIFIED,
            UserDocumentVerificationStatus.REJECTED,
        ],
        { message: 'status must be either VERIFIED or REJECTED' }
    )
    status: UserDocumentVerificationStatus.VERIFIED | UserDocumentVerificationStatus.REJECTED;

    @ValidateIf(dto => dto.status === UserDocumentVerificationStatus.REJECTED)
    @IsNotEmpty()
    @MinLength(5)
    remarks: string;
}