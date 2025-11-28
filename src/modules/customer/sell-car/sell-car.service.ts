import { BaseService } from '@common/base/base.service';
import { Injectable } from '@nestjs/common';
import { CarBrandRepository } from '@repository/car/car-brand.repository';

@Injectable()
export class SellCarService {
    constructor(
        private readonly baseService: BaseService,
        private readonly carBrandRepo: CarBrandRepository
    ) { }

    async findCarBrands() {
        return this.baseService.catch(async () => {
            return await this.carBrandRepo.findAllForCustomerApp();
        })
    }
}
