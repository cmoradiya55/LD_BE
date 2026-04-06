import { Injectable } from '@nestjs/common';
import { ActiveCityDto } from './dto/active-city.dto';
import { BaseService } from '@common/base/base.service';
import { CityRepository } from '@repository/general/city.repository';
import { GetAllCityDto } from './dto/get-all-city.dto';

@Injectable()
export class CityService {
    constructor(
        private readonly baseService: BaseService,
        private readonly cityRepo: CityRepository,
    ) { }

    async getAllCities(query: GetAllCityDto) {
        const { page, limit } = query;
        return await this.cityRepo.getAllCities(query, page, limit);
    }

    async getActiveCities(query: ActiveCityDto) {
        const { page, limit } = query;
        return await this.cityRepo.getActiveCities(page, limit);
    }
}
