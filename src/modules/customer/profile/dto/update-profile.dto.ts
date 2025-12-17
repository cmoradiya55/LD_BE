// src/modules/customer/profile/dto/update-profile.dto.ts

import { Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
    @IsNotEmpty({ message: 'Full name is required' })
    @IsString()
    @MaxLength(255)
    fullName: string;

    @Transform(({ value }) => value?.toLowerCase())
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsOptional()
    @IsString()
    profile_image?: string;
}