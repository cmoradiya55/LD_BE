import { Controller, Get, Param, Query } from '@nestjs/common';
import { CarService } from './car.service';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { CustomerCarBrandResource } from './resources/customer/customer-car-brand.resource';
import { CustomerCarBrandDto } from './dto/customer/customer-car-brand.dto';
import { CustomerCarModelFilterListingResource, CustomerCarModelResource } from './resources/customer/customer-car-model.resource';
import { CustomerCarModelFilterListingParamDto, CustomerCarModelParamDto, CustomerCarModelQueryDto, CustomerCarModelSearchInFilterQueryDto } from './dto/customer/customer-car-model.dto';
import { CustomerCarVariantParamDto } from './dto/customer/customer-car-variant.dto';
import { CustomerFuelTypeGroupResource } from './resources/customer/customer-fuel-type-group.resource';
import { CustomerCarModelSearchResource } from './resources/customer/car-model-search.resource';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) { }

  // Step 1: Get all brands
  @Get('brands')
  async getBrands(@Query() query: CustomerCarBrandDto) {
    const data = await this.carService.findCarBrands(query);

    return ApiResponseUtil.success(
      'Car brands fetched successfully',
      CustomerCarBrandResource.collection(data),
    );
  }

  @Get(':brandId/models')
  async getModelsByBrand(
    @Param() param: CustomerCarModelFilterListingParamDto,
  ) {
    const data = await this.carService.findModelsByBrand(param);
    return ApiResponseUtil.success(
      'Car models fetched successfully',
      CustomerCarModelFilterListingResource.collection(data),
    );
  }

  // Get years by brand
  @Get(':brandId/years')
  async getYearsByBrand(@Param('brandId') brandId: number) {
    const data = await this.carService.findYearsByBrand(brandId);
    return ApiResponseUtil.success(
      'Years fetched successfully',
      data,
    );
  }

  @Get(':brandId/year/:year/models')
  async getModelsByBrandAndYear(
    @Param() param: CustomerCarModelParamDto,
    @Query() query: CustomerCarModelQueryDto,
  ) {
    const data = await this.carService.findModelsByBrandAndYear(param, query);
    return ApiResponseUtil.success(
      'Car models fetched successfully',
      CustomerCarModelResource.collection(data),
    );
  }

  @Get('year/:year/model/:modelId/variants')
  async getVariantsByBrandYearAndModel(
    @Param() param: CustomerCarVariantParamDto,
  ): Promise<any> {
    const variants = await this.carService.getVariantsByBrandYearAndModel(param);

    return ApiResponseUtil.success(
      'Car variants fetched successfully',
      CustomerFuelTypeGroupResource.fromGroupedVariants(variants),
    );
  }

  @Get('models')
  async getModelsByBrandOrModel(@Query() query: CustomerCarModelSearchInFilterQueryDto) {
    const data = await this.carService.findModelsByBrandOrModel(query);
    return ApiResponseUtil.success(
      'Car models fetched successfully',
      CustomerCarModelSearchResource.collection(data),
    );
  }
}
