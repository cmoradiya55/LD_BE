import { Controller, Get, Param, Query } from '@nestjs/common';
import { SellCarService } from './sell-car.service';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { CarBrandResource } from './resources/car-brand.resource';
import { CarBrandDto } from './dto/car-brand.dto';
import { CarModelParamDto, CarModelQueryDto } from './dto/car-model.dto';
import { CarModelResource } from './resources/car-model.resource';
import { CarVariantParamDto, CarVariantQueryDto } from './dto/car-variant.dto';
import { CarVariantResource } from './resources/car-variant.resource';
import { FuelTypeGroupResource } from './resources/fuel-type-group.resource';
import { CitySuggestionDto } from './dto/city-suggestion.dto';
import { PincodeCitySuggestionResource } from './resources/pincode-city-suggestion.resource';

@Controller(`${MODULE_PREFIX.CUSTOMER}/sell-car`)
export class SellCarController {
  constructor(private readonly sellCarService: SellCarService) { }

  // Step 1: Get all brands
  @Get('brand')
  async getBrands(@Query() query: CarBrandDto) {
    const data = await this.sellCarService.findCarBrands(query);

    return ApiResponseUtil.success(
      CarBrandResource.collection(data),
      'Car brands fetched successfully');
  }

  // Step 2: Get years by brand
  @Get('brand/:brandId/years')
  async getYearsByBrand(@Param('brandId') brandId: number) {
    const data = await this.sellCarService.findYearsByBrand(brandId);
    return ApiResponseUtil.success(
      data,
      'Years fetched successfully'
    );
  }

  // Step 3: Get models by brand & year
  @Get('brand/:brandId/year/:year/models')
  async getModelsByBrandAndYear(
    @Param() param: CarModelParamDto,
    @Query() query: CarModelQueryDto,
  ) {
    const data = await this.sellCarService.findModelsByBrandAndYear(param, query);
    return ApiResponseUtil.success(
      CarModelResource.collection(data),
      'Car models fetched successfully'
    );
  }

  // Step 4: Get variants by model
  @Get('year/:year/model/:modelId/variants')
  async getVariantsByBrandYearAndModel(
    @Param() param: CarVariantParamDto,
  ): Promise<any> {
    const variants = await this.sellCarService.getVariantsByBrandYearAndModel(param);

    return ApiResponseUtil.success(
      FuelTypeGroupResource.fromGroupedVariants(variants),
      'Car variants fetched successfully'
    );
  }

  @Get('city-suggestions')
  async getCitySuggestions(@Query() queryDto: CitySuggestionDto) {
    const { data, total, page, limit } = await this.sellCarService.getCitySuggestions(queryDto);
    return ApiResponseUtil.paginated(
      PincodeCitySuggestionResource.collection(data),
      // data,
      page,
      limit,
      total,
      'City suggestions fetched successfully'
    );
  }


  // // Final: Submit car for selling
  // @Post()
  // submitCarForSale(@Body() dto: CreateSellCarDto) { }
  private toTitle(text: string) {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
