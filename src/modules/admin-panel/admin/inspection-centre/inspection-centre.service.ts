import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInspectionCentreDto } from './dto/create-inspection-centre.dto';
import { BaseService } from '@common/base/base.service';
import { CityRepository } from '@repository/general/city.repository';
import { InspectionCentreRepository } from '@repository/inspection-centre/inspection-centre.repository';
import { InspectionCentre } from '@entity/inapection-centre/inspection-centre.entity';

@Injectable()
export class InspectionCentreService {
    constructor(
        private readonly baseService: BaseService,
        private readonly cityRepo: CityRepository,
        private readonly inspectionCentreRepo: InspectionCentreRepository,
    ) { }

    async createInspectionCentre(adminUser: any, dto: CreateInspectionCentreDto): Promise<void> {
        return this.baseService.catch(async () => {
            const { address, landmark, cityId, pincodeId } = dto;

            const isCityAndPincodeValid = await this.cityRepo.validatePincodeInCity(cityId, pincodeId);
            if (!isCityAndPincodeValid) {
                throw new BadRequestException('The provided pincode does not belong to the specified city');
            }

            // check that in same pincode inspection centre not exists
            const existingCentre = await this.inspectionCentreRepo.findByPincodeAndCity(pincodeId, cityId);
            if (existingCentre) {
                throw new BadRequestException('An inspection centre already exists for the specified city and pincode');
            }

            // create inspection centre
            await this.inspectionCentreRepo.createAndSave({
                address,
                landmark,
                city_id: cityId,
                pincode_id: pincodeId,
                created_by: adminUser.id,
                updated_by: adminUser.id,
            } as InspectionCentre);
        })
    }

    async getInspectionCentres(): Promise<InspectionCentre[]> {
        return this.baseService.catch(async () => {
            const data = await this.inspectionCentreRepo.getAll();
            return data;
        });
    }
}
