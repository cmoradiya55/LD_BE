import { BaseService } from '@common/base/base.service';
import { User } from '@entity/user/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { StartInspectionDto } from './dto/start-inspection.dto';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { GetAssignedCarQueryDto } from './dto/get-assigned-car.dto';
import { SaveInspectionDraftDto, SaveInspectionDraftParamDto } from './dto/save-inspection.dto';
import { UsedCarListingStatus } from '@common/enums/car-detail.enum';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { VehicleHelper } from '@common/helpers/vehicle-helper';
import { InspectionImageRepository } from '@repository/used-car/inspection-image.repository';
import { CompleteInspectionParamDto } from './dto/complete-inpection.dto';
import { InspectionImageType } from '@common/providers/inspection-image/enum/inspection-image.enum';
import { BASIC_FIELD_RULES, REQUIRED_INSPECTION_IMAGES } from '@common/providers/inspection-image/config/inspection-image-validation.config';
import { InspectionImage } from '@entity/used-car/inspection-image.entity';

interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

interface ValidationError {
    field: string;
    message: string;
    code: string;
    details?: any;
}

@Injectable()
export class InspectionService {
    constructor(
        private readonly baseService: BaseService,
        private readonly usedCarRepo: UsedCarRepository,
        private readonly inspectionImageRepo: InspectionImageRepository,
    ) { }

    async startInspection(user: User, dto: StartInspectionDto): Promise<void> {
        return this.baseService.catch(async () => {
            const inspectorId = user.id;
            const { vehicleId } = dto;

            if (!user.isInspector() && !user.isManager()) {
                throw new BadRequestException('You are not authorized to start inspection');
            }

            // check that car is assigned to inspector
            const isInspectionAssigned = await this.usedCarRepo.checkInspectionAssigned(vehicleId, inspectorId);
            if (!isInspectionAssigned) throw new BadRequestException('Inspection not found for the vehicle');

            const updateResult = await this.usedCarRepo.startInspection(vehicleId, inspectorId);
            if (updateResult.affected === 0) {
                throw new BadRequestException('Failed to start inspection. Please try again.');
            }
        });
    }

    // ========================================
    // SAVE DRAFT - Idempotent, No Validation
    // ========================================
    async saveInspectionProgress(param: SaveInspectionDraftParamDto, user: User, dto: SaveInspectionDraftDto) {
        return this.baseService.catch(async (manager) => {

            // tregistrtion number major udate
            const { usedCarId } = param;
            const {
                registration_number,
                registration_year,
                km_driven,
                images,
                rc_image,
                insurance_image,
            } = dto;


            const car = await this.usedCarRepo.validateInspectorAccess(user, usedCarId, UsedCarListingStatus.INSPECTION_STARTED, manager);
            if (!car) {
                throw new BadRequestException('Inspection not found for the vehicle');
            }

            // Update car fields (partial)
            const carUpdates: Partial<UsedCar> = {};
            if (registration_number?.trim()) {
                const { original, clean, rtoCode } = VehicleHelper.normalizeRegistration(registration_number);

                carUpdates.registration_number = original;
                carUpdates.rto_code = rtoCode;
                carUpdates.registration_number_clean = clean;
            }

            if (registration_year?.toString().trim()) {
                carUpdates.registration_year = registration_year;
            }

            if (km_driven?.toString().trim()) {
                carUpdates.km_driven = km_driven;
            }

            if (rc_image?.toString().trim()) {
                carUpdates.rc_image = rc_image;
            }

            if (insurance_image?.toString().trim()) {
                carUpdates.insurance_image = insurance_image;
            }

            if (Object.keys(carUpdates).length > 0) {
                await this.usedCarRepo.update(
                    usedCarId,
                    user.id,
                    carUpdates,
                    manager
                );
            }

            // Save/update images
            if (images && images.length > 0) {
                const validImages = images.filter(img => img.image_url.trim());
                if (validImages.length > 0) {
                    // Upsert
                    await this.inspectionImageRepo.saveImagesUpsert(
                        usedCarId,
                        user.id,
                        validImages,
                        manager,
                    );
                }
            }
        }, true);
    }

    async completeInspection(user: User, param: CompleteInspectionParamDto) {
        return this.baseService.catch(async (manager) => {
            const { usedCarId } = param;
            const car = await this.usedCarRepo.validateInspectorAccess(user, usedCarId, UsedCarListingStatus.INSPECTION_STARTED, manager, true);
            if (!car) {
                throw new BadRequestException('Inspection already completed or not found for the vehicle');
            }

            const validation = this.validateInspection(car);

            if (!validation.isValid) {
                throw new BadRequestException({
                    message: 'Inspection incomplete. Please fix the following issues:',
                    errors: validation.errors,
                });
            }

            // Update status
            await this.usedCarRepo.completeInspection(
                usedCarId,
                user.id,
                manager,
            );

        }, true);
    }

    async getAssignedCars(
        user: User,
        query: GetAssignedCarQueryDto
    ) {
        return this.baseService.catch(async () => {
            // show car belongs to city of manager only
            const { page, limit } = query;

            const result = await this.usedCarRepo.getInspectorAssignedCarListQuery(
                user.id,
                query,
                page,
                limit
            );
            return result;
        });
    }

    private validateInspection(car: UsedCar): ValidationResult {
        const errors: ValidationError[] = [];

        // 1. Basic fields
        errors.push(...this.validateBasicFields(car));

        // 2. Images
        errors.push(...this.validateImages(car.inspectionImages || []));

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    private validateBasicFields(car: UsedCar): ValidationError[] {
        return BASIC_FIELD_RULES
            .filter(rule => !rule.validator(car))
            .map(rule => ({
                field: rule.field,
                message: rule.message,
                code: rule.code,
            }));
    }

    private validateImages(images: InspectionImage[]): ValidationError[] {
        const errors: ValidationError[] = [];

        const activeImages = images.filter(img => img.is_active);

        if (activeImages.length === 0) {
            errors.push({
                field: 'images',
                message: 'At least one inspection image is required',
                code: 'NO_IMAGES',
            });
            return errors;
        }

        // ✅ Create Set for O(1) lookup
        const existingImages = new Set(
            activeImages.map(img => `${img.image_type}-${img.image_subtype}`)
        );

        // ✅ Find missing mandatory images
        const missingImages = REQUIRED_INSPECTION_IMAGES
            .filter(req => req.isMandatory)
            .filter(req => !existingImages.has(`${req.type}-${req.subtype}`));

        if (missingImages.length > 0) {
            errors.push({
                field: 'images.missing',
                message: `Missing ${missingImages.length} required image(s)`,
                code: 'MISSING_REQUIRED_IMAGES',
                details: {
                    count: missingImages.length,
                    missing: missingImages.map(img => ({
                        type: img.type,
                        subtype: img.subtype,
                        name: img.name,
                    })),
                },
            });
        }

        // ✅ Validate damage remarks
        const damagedWithoutRemarks = activeImages.filter(
            img => img.has_damage && (!img.remarks || img.remarks.trim() === '')
        );

        if (damagedWithoutRemarks.length > 0) {
            errors.push({
                field: 'images.damage_remarks',
                message: `${damagedWithoutRemarks.length} damaged item(s) need remarks`,
                code: 'MISSING_DAMAGE_REMARKS',
                details: {
                    count: damagedWithoutRemarks.length,
                    images: damagedWithoutRemarks.map(img => ({
                        type: img.image_type,
                        subtype: img.image_subtype,
                    })),
                },
            });
        }

        // ✅ Validate OTHER type
        const otherImages = activeImages.filter(
            img => img.image_type === InspectionImageType.OTHER
        );

        const invalidOtherImages = otherImages.filter(
            img => !img.title?.trim() && !img.remarks?.trim()
        );

        if (invalidOtherImages.length > 0) {
            errors.push({
                field: 'images.other',
                message: 'Other images must have a title or remarks',
                code: 'INVALID_OTHER_IMAGES',
                details: { count: invalidOtherImages.length },
            });
        }

        return errors;
    }
}
