import { IsOptional } from "class-validator";

export class SearchQueryDto {
    @IsOptional()
    search?: string;
}