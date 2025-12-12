import { BaseService } from '@common/base/base.service';
import { Injectable } from '@nestjs/common';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { UsedCarListingDto } from './dto/used-car-listing.dto';
import { UsedCarDetailParamDto } from './dto/used-car-detail.dto';

@Injectable()
export class UsedCarService {
    constructor(
        private readonly baseService: BaseService,
        private readonly usedCarRepository: UsedCarRepository,
    ) { }

    /**
     * Get used cars list with filters and pagination
     */
    async findUsedCars(
        query: UsedCarListingDto,
        customerId?: number,
    ) {
        return this.baseService.catch(async () => {
            const result = await this.usedCarRepository.findUsedCars(query, customerId);

            return result;
        })
    }

    async getUsedCarDetailBySlug(params: UsedCarDetailParamDto) {
        return this.baseService.catch(async () => {
            const { slug } = params;

            const result = await this.usedCarRepository.getUsedCarDetailBySlug(slug);

            return result;
        })
    }
}
