import { BaseService } from '@common/base/base.service';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CarBrandRepository } from '@repository/car/car-brand.repository';
import { CarBrandDto } from './dto/car-brand.dto';
import { CarModelRepository } from '@repository/car/car-model.repository';
import { CarModelParamDto, CarModelQueryDto } from './dto/car-model.dto';
import { CarVariantParamDto, CarVariantQueryDto } from './dto/car-variant.dto';
import { CarVariantRepository, FuelTypeGroup } from '@repository/car/car-variant.repository';
import { CityRepository } from '@repository/general/city.repository';
import { CitySuggestionDto } from './dto/city-suggestion.dto';
import { PincodeRepository } from '@repository/general/pincode.repository';

@Injectable()
export class SellCarService {
    constructor(
        private readonly baseService: BaseService,
        private readonly carBrandRepo: CarBrandRepository,
        private readonly carModelRepo: CarModelRepository,
        private readonly carVariantRepo: CarVariantRepository,
        private readonly pincodeRepo: PincodeRepository,
    ) { }

    async findCarBrands(query: CarBrandDto) {
        return this.baseService.catch(async () => {
            return await this.carBrandRepo.findAllForCustomerApp(query?.search);
        })
    }

    async findYearsByBrand(brandId: number) {
        return this.baseService.catch(async () => {
            const yearRange = await this.carBrandRepo.findYearRangeByBrandId(brandId);
            if (!yearRange) throw new NotFoundException(`Car brand not found`);

            const startYear = yearRange.operation_start_year;
            const endYear = yearRange.operation_end_year ?? new Date().getFullYear();

            // Generate years array
            const years: number[] = [];
            for (let year = endYear; year >= startYear; year--) {
                years.push(year);
            }

            return years;
        });
    }

    async findModelsByBrandAndYear(param: CarModelParamDto, query: CarModelQueryDto) {
        return this.baseService.catch(async () => {
            const { brandId, year } = param;
            const { search } = query;
            return await this.carModelRepo.findByBrandIdAndYear(brandId, year, search);
        });
    }

    async getVariantsByBrandYearAndModel(param: CarVariantParamDto) {
        return this.baseService.catch(async () => {
            const { year, modelId } = param;
            return await this.carVariantRepo.findByBrandIdYear(year, modelId);
        });
    }

    async getCitySuggestions(queryDto: CitySuggestionDto) {
        return this.baseService.catch(async () => {
            const { q, page, limit } = queryDto;
            return this.pincodeRepo.getPincodeAndCitySuggestion(q, page, limit);
        });
    }
}
