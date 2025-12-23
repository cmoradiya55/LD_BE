import { BaseService } from '@common/base/base.service';
import { User } from '@entity/user/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { StartInspectionDto } from './dto/start-inspection.dto';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';

@Injectable()
export class InspectionService {
    constructor(
        private readonly baseService: BaseService,
        private readonly usedCarRepo: UsedCarRepository,
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

    async saveInspectionProgress() {
        return this.baseService.catch(async (manager) => {
            // Implementation for saving inspection progress
        
        }, true);
    }
}
