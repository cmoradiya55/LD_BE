import { IsNotEmpty, IsString } from "class-validator";

export class UsedCarDetailParamDto {
    @IsNotEmpty()
    @IsString()
    slug: string;
}