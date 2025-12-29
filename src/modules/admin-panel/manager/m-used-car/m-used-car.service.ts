import { BaseService } from '@common/base/base.service';
import { User } from '@entity/user/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetUsedCarQueryDto } from './dto/get-inspector.dto';
import { InspectionCentreRepository } from '@repository/inspection-centre/inspection-centre.repository';
import { CityRepository } from '@repository/general/city.repository';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { MAssignInspectorDto } from './dto/m-assign-inspector.dto';
import { UserRepository } from '@repository/user/user.repository';

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

            const inspectionCentre = await this.inspectionCentreRepo.findById(user.inspection_centre_id!);
            if (!inspectionCentre || inspectionCentre.is_active === false) {
                throw new Error('Inspection centre not found or inactive');
            }

            const pincodeIds = await this.cityRepo.getPincodeIdsByCityId(inspectionCentre.city_id);
            if (pincodeIds.length === 0) {
                throw new Error('No pincodes found for the city assigned to the manager');
            }

            const result = await this.usedCarRepo.findUsedCarsForAdminPanel(pincodeIds, page, limit);
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
                    inspectorId,
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
                );
                if (result.affected === 0) {
                    throw new Error('Failed to assign inspector. Please check the Car ID.');
                }
            }
        });
    }
}
