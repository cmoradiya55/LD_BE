import { BaseService } from '@common/base/base.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerCarBrandDto } from './dto/customer/customer-car-brand.dto';
import { CarBrandRepository } from '@repository/car/car-brand.repository';
import { CarModelRepository } from '@repository/car/car-model.repository';
import { CustomerCarModelFilterListingParamDto, CustomerCarModelParamDto, CustomerCarModelQueryDto, CustomerCarModelSearchInFilterQueryDto } from './dto/customer/customer-car-model.dto';
import { CustomerCarVariantParamDto } from './dto/customer/customer-car-variant.dto';
import { CarVariantRepository } from '@repository/car/car-variant.repository';

@Injectable()
export class CarService {
    constructor(
        private readonly baseService: BaseService,
        private readonly carBrandRepo: CarBrandRepository,
        private readonly carModelRepo: CarModelRepository,
        private readonly carVariantRepo: CarVariantRepository,
    ) { }

    // Get all brands
    async findCarBrands(query: CustomerCarBrandDto) {
        return this.baseService.catch(async () => {
            return await this.carBrandRepo.findAllForCustomerApp(query?.search);
        })
    }

    // Get models by brand for filter listing (without year)
    async findModelsByBrand(param: CustomerCarModelFilterListingParamDto) {
        return this.baseService.catch(async () => {
            const { brandId } = param;
            return await this.carModelRepo.findByBrandId(brandId);
        });
    }

    // Get years by brand
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

    // Get models by brand and year
    async findModelsByBrandAndYear(param: CustomerCarModelParamDto, query: CustomerCarModelQueryDto) {
        return this.baseService.catch(async () => {
            const { brandId, year } = param;
            const { search } = query;
            return await this.carModelRepo.findByBrandIdAndYear(brandId, year, search);
        });
    }

    // Get variants by brand, year and model
    async getVariantsByBrandYearAndModel(param: CustomerCarVariantParamDto) {
        return this.baseService.catch(async () => {
            const { year, modelId } = param;
            return await this.carVariantRepo.findByBrandIdYear(year, modelId);
        });
    }


    // Get models by brand and year
    async findModelsByBrandOrModel(query: CustomerCarModelSearchInFilterQueryDto) {
        return this.baseService.catch(async () => {
            const { search } = query;
            if (!search) {
                return [];
            }
            return await this.carModelRepo.findModelsByBrandOrModel(search);
        });
    }
}
