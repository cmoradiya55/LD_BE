import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInspectionCentreDto } from './dto/create-inspection-centre.dto';
import { BaseService } from '@common/base/base.service';
import { CityRepository } from '@repository/general/city.repository';
import { InspectionCentreRepository } from '@repository/inspection-centre/inspection-centre.repository';
import { InspectionCentre } from '@entity/inapection-centre/inspection-centre.entity';
import { UpdateInspectionCenterParamDto, UpdateInspectionCentreDto } from './dto/update-inspection-centre.dto';
import { User } from '@entity/user/user.entity';

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
                is_active: true,
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

    async getAllInspectionCentreDetails() {
        return this.baseService.catch(async () => {
            const data = await this.cityRepo.getAllInspectionCentreDetails();
            return data;
        });
    }

    async updateInspectionCentre(param: UpdateInspectionCenterParamDto, adminUser: User, dto: UpdateInspectionCentreDto): Promise<void> {
        return this.baseService.catch(async () => {
            const { address, landmark, cityId, pincodeId } = dto;
            const { id } = param;
            
            const inspectionCentre = await this.inspectionCentreRepo.findById(id);
            if (!inspectionCentre) {
                throw new BadRequestException('Inspection centre not found');
            }

            const finalCityId = cityId ?? inspectionCentre.city_id;
            const finalPincodeId = pincodeId ?? inspectionCentre.pincode_id;

            // Validate city–pincode combination only if either changed
            const isCityChanged = finalCityId !== inspectionCentre.city_id;
            const isPincodeChanged = finalPincodeId !== inspectionCentre.pincode_id;

            if (isCityChanged || isPincodeChanged) {
                const isValid = await this.cityRepo.validatePincodeInCity(
                    finalCityId,
                    finalPincodeId
                );

                if (!isValid) {
                    throw new BadRequestException(
                        'The provided pincode does not belong to the specified city'
                    );
                }
            }

            await this.inspectionCentreRepo.updateById(id, {
                address: address ?? inspectionCentre.address,
                landmark: landmark ?? inspectionCentre.landmark,
                city_id: finalCityId,
                pincode_id: finalPincodeId,
                updated_by: adminUser.id,
            });
        });
    }
}
