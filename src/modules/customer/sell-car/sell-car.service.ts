import { BaseService } from '@common/base/base.service';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CarBrandRepository } from '@repository/car/car-brand.repository';
import { CarBrandDto } from './dto/car-brand.dto';
import { CarModelRepository } from '@repository/car/car-model.repository';
import { CarModelParamDto, CarModelQueryDto } from './dto/car-model.dto';
import { CarVariantParamDto, CarVariantQueryDto } from './dto/car-variant.dto';
import { CarVariantRepository, FuelTypeGroup } from '@repository/car/car-variant.repository';
import { CityRepository } from '@repository/general/city.repository';
import { CitySuggestionDto } from './dto/city-suggestion.dto';
import { PincodeRepository } from '@repository/general/pincode.repository';
import { CreateSellCarDto } from './dto/create-sell-car.dto';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { UsedCarListingStatus } from '@common/enums/car-detail.enum';
import { UsedCarCustomerPhotoRepository } from '@repository/used-car/used-car-customer-photo.repository';
import { UsedCarCustomerPhoto } from '@entity/used-car/used-car-customer-photo.entity';
import { VehicleHelper } from '@common/helpers/vehicle-helper';
import { SlugHelper } from '@common/helpers/slug.helper';

@Injectable()
export class SellCarService {
    constructor(
        private readonly baseService: BaseService,
        private readonly carBrandRepo: CarBrandRepository,
        private readonly carModelRepo: CarModelRepository,
        private readonly carVariantRepo: CarVariantRepository,
        private readonly pincodeRepo: PincodeRepository,
        private readonly usedCarRepo: UsedCarRepository,
        private readonly usedCarCustomerPhotoRepo: UsedCarCustomerPhotoRepository,
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

    async submitCarForSale(user: any, dto: CreateSellCarDto) {
        return this.baseService.catch(async (manager) => {
            const {
                brandId,
                year,
                modelId,
                variantId,
                ownerType,
                odometerReading,
                pincodeId,
                expectedPrice,
                registrationNumber,
                photos,
            } = dto

            // 1. Check duplicate registration number
            await this.usedCarRepo.checkDuplicateRegistration(
                registrationNumber,
                manager,
            );

            const { original, clean, rtoCode } = VehicleHelper.normalizeRegistration(registrationNumber);

            // 2. validate pincode is valid
            const isPincodeActive = await this.pincodeRepo.isPincodeActive(pincodeId, manager);
            if (!isPincodeActive) throw new NotFoundException('The provided pincode is not serviceable');

            // 3. validate car brand, year, model, variant
            const result = await this.carBrandRepo.verifyCarDetails(
                brandId,
                year,
                modelId,
                variantId,
                manager,
            );
            if (!result) throw new BadRequestException('Some of the selected car details are invalid');

            const usedCar = this.usedCarRepo.create({
                user_id: user.id,
                brand_id: brandId,
                registration_year: year,
                model_id: modelId,
                variant_id: variantId,
                owner_type: ownerType,
                km_driven_range: odometerReading,
                pincode_id: pincodeId,
                expected_price: expectedPrice,
                registration_number: original,
                registration_number_clean: clean,
                rto_code: rtoCode,
                status: UsedCarListingStatus.PENDING
            } as UsedCar, manager);
            const savedUsedCar = await this.usedCarRepo.save([usedCar], manager);

            const slug = SlugHelper.generateUsedCarSlug(
                result.brand.slug,    // e.g., "maruti"
                result.model.slug,    // e.g., "swift"
                result.variant.slug,  // e.g., "vxi"
                savedUsedCar[0].id     // 1234
            );

            savedUsedCar[0].slug = slug;
            await this.usedCarRepo.save([savedUsedCar[0]], manager);

            const usedCarPhotos = this.usedCarCustomerPhotoRepo.createMultiple(
                photos.map(photoKey => ({
                    used_car_id: savedUsedCar[0].id,
                    url: photoKey,
                })) as UsedCarCustomerPhoto[],
                manager
            );
            await this.usedCarCustomerPhotoRepo.save(usedCarPhotos, manager);

            return savedUsedCar[0];
        }, true);
    }
}
function extractRTOCodeFromRegistrationNumber(registrationNumber: string) {
    throw new Error('Function not implemented.');
}

