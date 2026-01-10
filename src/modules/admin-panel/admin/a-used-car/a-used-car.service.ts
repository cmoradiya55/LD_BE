import { BaseService } from '@common/base/base.service';
import { Injectable } from '@nestjs/common';
import { GetAllUsedCarsForAdminDto } from './dto/get-all-used-cars-for-admin.dto';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { GetUsedCarDetailForAdminParamDto } from './dto/get-used-car-detail.dto';

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
}
