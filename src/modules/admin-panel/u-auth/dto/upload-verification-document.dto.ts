import { IsNotEmpty, IsString, Matches } from "class-validator";

export class UploadUserDocumentsDto {
    @IsNotEmpty()
    @IsString()
    selfieImage: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{12}$/, { message: 'Aadhar card number must be 12 digits' })
    aadharCardNo: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN card number format' })
    panCardNo: string;


    @IsNotEmpty()
    @IsString()
    aadharCardFrontImage: string;

    @IsNotEmpty()
    @IsString()
    aadharCardBackImage: string;


    @IsNotEmpty()
    @IsString()
    panCardImage: string;
}