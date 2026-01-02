import { BaseService } from '@common/base/base.service';
import { User } from '@entity/user/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { StartInspectionDto } from './dto/start-inspection.dto';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { GetAssignedCarQueryDto } from './dto/get-assigned-car.dto';
import { SaveInspectionDraftDto, SaveInspectionDraftParamDto } from './dto/save-inspection-image.dto';
import { UsedCarListingStatus } from '@common/enums/car-detail.enum';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { VehicleHelper } from '@common/helpers/vehicle-helper';
import { InspectionImageRepository } from '@repository/used-car/inspection-image.repository';

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

            await this.usedCarRepo.startInspection(vehicleId, inspectorId);
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

    // ========================================
    // SUBMIT - Comprehensive DB Validation
    // ========================================
    // async submitInspection(user: User, dto: SubmitInspectionDto) {
    // return this.baseService.catch(async (manager) => {
    //     const car = await this.validateInspectorAccess(user, dto.usedCarId, manager);

    //     // ✅ Validate from DB
    //     const validation = await this.validateInspectionData(car.id, manager);

    //     if (!validation.isValid) {
    //         throw new BadRequestException({
    //             message: 'Inspection incomplete. Please fix the following issues:',
    //             errors: validation.errors,
    //             completionPercentage: validation.completionPercentage,
    //         });
    //     }

    //     // ✅ Update car with final submission data
    //     await this.usedCarRepo.update(car.id, {
    //         status: UsedCarListingStatus.INSPECTED,
    //         inspected_at: new Date(),
    //         inspected_by: user.id,
    //         inspector_remarks: dto.inspectorRemarks,
    //         final_price: dto.finalPrice,
    //         is_verified: dto.isCarPassed ?? true,
    //     }, manager);

    //     // ✅ Create inspection report (async)
    //     await this.generateInspectionReport(car.id, manager);

    //     // ✅ Notify stakeholders
    //     await this.notifyInspectionComplete(car.id);

    //     return {
    //         message: 'Inspection submitted successfully',
    //         carId: car.id,
    //         reportUrl: `/inspections/${car.id}/report`,
    //     };
    // }, true);
    // }

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

    // ========================================
    // VALIDATION - From Database
    // ========================================
    // private async validateInspectionData(
    //     carId: number,
    //     manager: EntityManager,
    // ): Promise<ValidationResult> {
    //     const errors: ValidationError[] = [];

    //     // Load car with all inspection data
    //     const car = await this.usedCarRepo.findOne({
    //         where: { id: carId },
    //         relations: ['inspectionImages'],
    //     }, manager);

    //     // 1. Basic car details
    //     if (!car.registration_number) {
    //         errors.push({ field: 'registration_number', message: 'Required', code: 'REQUIRED' });
    //     }
    //     if (!car.registration_year) {
    //         errors.push({ field: 'registration_year', message: 'Required', code: 'REQUIRED' });
    //     }
    //     if (car.km_driven === null) {
    //         errors.push({ field: 'km_driven', message: 'Required', code: 'REQUIRED' });
    //     }

    //     // 2. Images validation
    //     const imageValidation = this.validateImages(car.inspectionImages);
    //     errors.push(...imageValidation.errors);

    //     // 3. Documents validation
    //     const hasRC = car.inspectionImages.some(img =>
    //         img.image_type === InspectionImageType.OTHER && img.title === 'RC_DOCUMENT'
    //     );
    //     const hasInsurance = car.inspectionImages.some(img =>
    //         img.image_type === InspectionImageType.OTHER && img.title === 'INSURANCE_DOCUMENT'
    //     );

    //     if (!hasRC) errors.push({ field: 'documents', message: 'RC document required', code: 'MISSING_RC' });
    //     if (!hasInsurance) errors.push({ field: 'documents', message: 'Insurance document required', code: 'MISSING_INSURANCE' });

    //     // 4. Calculate completion
    //     const totalRequired = 20; // Define based on your requirements
    //     const completed = this.countCompletedItems(car);
    //     const completionPercentage = Math.round((completed / totalRequired) * 100);

    //     return {
    //         isValid: errors.length === 0 && completionPercentage >= 80,
    //         errors,
    //         completionPercentage,
    //     };
    // }
}
