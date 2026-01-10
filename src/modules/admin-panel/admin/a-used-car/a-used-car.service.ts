import { BaseService } from '@common/base/base.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetAllUsedCarsForAdminDto } from './dto/get-all-used-cars-for-admin.dto';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { GetUsedCarDetailForAdminParamDto } from './dto/get-used-car-detail.dto';
import { UsedCarChangeStatusDto, UsedCarChangeStatusParamDto } from './dto/used-car-chnage-status.dto';
import { UsedCarListingStatus } from '@common/enums/car-detail.enum';
import { AdminUsedCarApprovalStatus } from '@common/enums/used-car-status.enum';

@Injectable()
export class AUsedCarService {
    constructor(
        private readonly baseService: BaseService,
        private readonly usedCarRepo: UsedCarRepository,
    ) { }

    async getAllUsedCars(query: GetAllUsedCarsForAdminDto) {
        return this.baseService.catch(async () => {
            const { page, limit } = query;
            return this.usedCarRepo.getAllUsedCarsForAdmin(query, page, limit);
        })
    }

    async getUsedCarDetail(param: GetUsedCarDetailForAdminParamDto) {
        return this.baseService.catch(async () => {
            const { id } = param;
            return await this.usedCarRepo.getUsedCarDetailForAdmin(id);
        })
    }

    async updateUsedCarStatus(param: UsedCarChangeStatusParamDto, body: UsedCarChangeStatusDto) {
        return this.baseService.catch(async (manager) => {
            const { id } = param;
            const { status, price, reason } = body;

            const usedCar = await this.usedCarRepo.findByIdRaw(id, manager);
            if (!usedCar) {
                throw new BadRequestException('Used car not found');
            }

            if (status === AdminUsedCarApprovalStatus.APPROVED) {
                if (usedCar.status !== UsedCarListingStatus.APPROVED_BY_MANAGER) {
                    throw new BadRequestException('Used car is not approved by manager yet or already approved by admin');
                }

                usedCar.status = UsedCarListingStatus.APPROVED_BY_ADMIN;
                usedCar.final_price = Number(price);
                usedCar.approved_at = new Date();
                await this.usedCarRepo.update(id, usedCar, manager);

                return {
                    message: 'Car has been approved successfully',
                }

            } else if (status === AdminUsedCarApprovalStatus.CANCELLED) {
                if (usedCar.status !== UsedCarListingStatus.APPROVED_BY_MANAGER) {
                    throw new BadRequestException('Used car is not approved by manager yet or already rejected by admin');
                }

                usedCar.status = UsedCarListingStatus.REJECTED_BY_ADMIN;
                usedCar.cancel_reason = reason;
                await this.usedCarRepo.update(id, usedCar, manager);
                return {
                    message: 'Car has been rejected successfully',
                }
            } else {
                throw new BadRequestException('Invalid status for update');
            }
        }, true)
    }
}
