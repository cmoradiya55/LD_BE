import { BaseService } from '@common/base/base.service';
import { User } from '@entity/user/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { UpdateVehicleDetailsDto, UpdateVehicleDetailsParamDto } from './dto/update-vehicle-detail.dto';
import { UsedCarListingStatus } from '@common/enums/car-detail.enum';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { GetVehicleListQueryDto } from './dto/get-vehicle-list.dto';

@Injectable()
export class VehicleVerificationService {
    constructor(
        private readonly baseService: BaseService,
        private readonly usedCarRepository: UsedCarRepository,
    ) { }

    async updateVehicleDetails(
        user: User,
        param: UpdateVehicleDetailsParamDto,
        dto: UpdateVehicleDetailsDto,
    ) {
        return this.baseService.catch(async (manager) => {
            const { id } = param;
            const {
                registrationDate,
                fitnessValidUntil,
                insuranceValidUntil,
                pucValidUntil,
                challanDetails,
                loanStatus,
                owner,
                registrationPlace,
                isBlacklisted,
                isRtoNocIssued,
                isPartyPeshi,
                isHypothecated,
                isConverted,
                isMigrated,
                adaptedForSpecialUse,
                criminalCases,
                civilCases,
                roadAccidents,
                compensationCases,
                otherCases,
                staffRemarks,
            } = dto;

            const isVehicleValid = await this.usedCarRepository.findByIdRaw(id, manager);
            if (!isVehicleValid) {
                throw new BadRequestException('Vehicle not found');
            }

            if (isVehicleValid.status >= UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF) {
                throw new BadRequestException('Vehicle details already updated by you or another staff member');
            }

            const updateData: Partial<UsedCar> = {
                registration_date: new Date(registrationDate),
                fitness_valid_until: new Date(fitnessValidUntil),
                insurance_valid_until: new Date(insuranceValidUntil),
                puc_valid_until: new Date(pucValidUntil),
                challan_details: challanDetails, // ✅ Direct JSON assignment
                loan_status: loanStatus,
                owner: owner,
                registration_place: registrationPlace,
                is_blacklisted: isBlacklisted,
                is_rto_noc_issued: isRtoNocIssued,
                is_party_peshi: isPartyPeshi,
                is_hypothecated: isHypothecated,
                is_converted: isConverted,
                is_migrated: isMigrated,
                adapted_for_special_use: adaptedForSpecialUse,
                criminal_cases: criminalCases,
                civil_cases: civilCases,
                road_accidents: roadAccidents,
                compensation_cases: compensationCases,
                other_cases: otherCases,
                staff_remarks: staffRemarks,
                updated_by_staff: user.id,
                staff_updated_at: new Date(),
                status: UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF,
            };

            await this.usedCarRepository.update(id, updateData, manager);
        }, true)
    }

    async getVehicleList(query: GetVehicleListQueryDto) {
        return this.baseService.catch(async () => {
            const { page, limit } = query;
            return await this.usedCarRepository.getVehicleListForStaffDashboard(query, page, limit);
        });
    }

    async getVehicleDetails(id: number) {
        return this.baseService.catch(async () => {
            const vehicle = await this.usedCarRepository.getCarDetailsForStaff(id);
            if (!vehicle) {
                throw new BadRequestException('Vehicle not found');
            }
            return vehicle;
        });
    }
}
