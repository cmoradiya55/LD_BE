import { BaseService } from '@common/base/base.service';
import { User } from '@entity/user/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetUsedCarQueryDto } from './dto/get-inspector.dto';
import { InspectionCentreRepository } from '@repository/inspection-centre/inspection-centre.repository';
import { CityRepository } from '@repository/general/city.repository';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { MAssignInspectorDto } from './dto/m-assign-inspector.dto';
import { UserRepository } from '@repository/user/user.repository';
import { GetInspectionReportParamDto } from './dto/get-inspection-report.dto';
import { MApproveAndSuggestPriceDto, MApproveAndSuggestPriceParamDto } from './dto/approve-and-suggest-price.dto';
import { UsedCarListingStatus } from '@common/enums/car-detail.enum';

@Injectable()
export class MUsedCarService {
    constructor(
        private readonly baseService: BaseService,
        private readonly inspectionCentreRepo: InspectionCentreRepository,
        private readonly cityRepo: CityRepository,
        private readonly usedCarRepo: UsedCarRepository,
        private readonly userRepo: UserRepository,
    ) { }

    async getUsedCars(
        user: User,
        query: GetUsedCarQueryDto,
    ) {
        return this.baseService.catch(async () => {
            // show car belongs to city of manager only
            const { page, limit } = query;
            if (!user.inspection_centre_id) {
                throw new Error('Manager is not assigned to any inspection centre');
            }

            const inspectionCentre = await this.inspectionCentreRepo.findById(user.inspection_centre_id);
            if (!inspectionCentre || inspectionCentre.is_active === false) {
                throw new Error('Inspection centre not found or inactive');
            }

            const pincodeIds = await this.cityRepo.getPincodeIdsByCityId(inspectionCentre.city_id);
            if (pincodeIds.length === 0) {
                throw new Error('No pincodes found for the city assigned to the manager');
            }

            const result = await this.usedCarRepo.findUsedCarsForAdminPanel(user, pincodeIds, query, page, limit);
            return result;
        });
    }

    async assignInspector(
        user: User,
        body: MAssignInspectorDto
    ) {
        return this.baseService.catch(async () => {
            const { inspectorId, usedCarId } = body;

            if (user.id === inspectorId) {
                // assign directly
                const result = await this.usedCarRepo.assignInspectorToUsedCar(
                    usedCarId,
                    user.id,
                    user.id
                );
                if (result.affected === 0) {
                    throw new BadRequestException('Failed to assign inspector. Please check the Car ID.');
                }
            } else {
                // check that inspector belongs to that manager 
                const isValidInspector = await this.userRepo.checkInspectorExistsUnderManager(inspectorId, user.id);

                if (!isValidInspector) {
                    throw new BadRequestException('Inspector does not belong to this manager');
                }

                const result = await this.usedCarRepo.assignInspectorToUsedCar(
                    usedCarId,
                    inspectorId,
                    user.id
                );
                if (result.affected === 0) {
                    throw new Error('Failed to assign inspector. Please check the Car ID.');
                }
            }
        });
    }

    async getInspectionReport(
        user: User,
        param: GetInspectionReportParamDto
    ) {
        return this.baseService.catch(async () => {
            const { usedCarId } = param;

            const report = await this.usedCarRepo.getInspectionDetailsByManager(user, usedCarId);
            if (!report) {
                throw new BadRequestException('Inspection report not found for the selected car');
            }
            return report;
        });
    }

    async approveUsedCarAndSuggestPrice(
        user: User,
        param: MApproveAndSuggestPriceParamDto,
        body: MApproveAndSuggestPriceDto,
    ) {
        return this.baseService.catch(async (manager) => {
            const { price } = body;
            const { usedCarId } = param;

            //    check that car is assigned under that manager and car status is valid for approval
            const usedCar = await this.usedCarRepo.findByIdRaw(usedCarId, manager);
            if (!usedCar) {
                throw new BadRequestException('Car not found');
            }

            if (usedCar.assigned_by !== user.id) {
                throw new BadRequestException('You are not authorized to approve this car');
            }

            if (usedCar.status >= UsedCarListingStatus.APPROVED_BY_MANAGER) {
                throw new BadRequestException('Car is already approved');
            }
            
            // update the price and status
            await this.usedCarRepo.update(
                usedCarId,
                {
                    manager_suggested_price: price,
                    status: UsedCarListingStatus.APPROVED_BY_MANAGER,
                },
                manager
            );
        }, true);
    }
}
