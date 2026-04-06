import { BaseService } from '@common/base/base.service';
import { FuelType, UsedCarListingStatus } from '@common/enums/car-detail.enum';
import { VehicleHelper } from '@common/helpers/vehicle-helper';
import { BASIC_FIELD_RULES, ENGINE_COMMON_MANDATORY, ENGINE_ELECTRIC_MANDATORY, ENGINE_ICE_MANDATORY, REQUIRED_INSPECTION_IMAGES } from '@common/providers/inspection-image/config/inspection-image-validation.config';
import { IMAGE_SUBTYPE_NAMES, InspectionImageType } from '@common/providers/inspection-image/enum/inspection-image.enum';
import { InspectionImage } from '@entity/used-car/inspection-image.entity';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { User } from '@entity/user/user.entity';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InspectionImageRepository } from '@repository/used-car/inspection-image.repository';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { MStartInspectionDto } from './dto/start-inspection.dto';
import { MSaveInspectionDraftDto, MSaveInspectionDraftParamDto } from './dto/save-inspection.dto';
import { MCompleteInspectionParamDto } from './dto/complete-inpection.dto';
import { InspectionService } from '../../inspector/inspection/inspection.service';

interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

interface ValidationError {
    field: string;
    message: string;
    code: string;
    details?: ValidationErrorDetails;
}

interface ValidationErrorDetails {
    count?: number;
    missing?: Array<{
        type: number;
        subtype: number;
        name: string;
    }>;
    images?: Array<{
        type: number;
        subtype: number;
    }>;
    fuelType?: FuelType;
    percentage?: number;
    required?: number;
    found?: number;
    [key: string]: any; // Allow additional fields if needed
}


@Injectable()
export class MInspectionService {
    constructor(
        private readonly baseService: BaseService,
        private readonly usedCarRepo: UsedCarRepository,
        private readonly inspectionImageRepo: InspectionImageRepository,
        private readonly inspectionService: InspectionService
    ) { }

    async startInspection(user: User, dto: MStartInspectionDto): Promise<{ code: number; message: string }> {
        return this.baseService.catch(async () => {
            const { code, message } = await this.inspectionService.startInspection(user, dto);
            return { code, message }
        });
    }

    // ========================================
    // SAVE DRAFT - Idempotent, No Validation
    // ========================================
    async saveInspectionProgress(param: MSaveInspectionDraftParamDto, user: User, dto: MSaveInspectionDraftDto) {
        return this.baseService.catch(async () => {
            return await this.inspectionService.saveInspectionProgress(param, user, dto);
        });
    }

    async completeInspection(user: User, param: MCompleteInspectionParamDto) {
        return this.baseService.catch(async () => {
            return await this.inspectionService.completeInspection(user, param);
        });
    }

    async getInspectionDetails(user: User, usedCarId: number) {
        return this.baseService.catch(async () => {
            const car = await this.usedCarRepo.getInspectionDetailsByInspector(user, usedCarId);
            if (!car) {
                throw new BadRequestException('Inspection not found for the vehicle');
            }
            return car;
        });
    }
}
