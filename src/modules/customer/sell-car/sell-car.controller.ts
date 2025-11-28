import { Controller, Get } from '@nestjs/common';
import { SellCarService } from './sell-car.service';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { CarBrandResource } from './resources/abc';

@Controller(`${MODULE_PREFIX.CUSTOMER}/sell-car`)
export class SellCarController {
  constructor(private readonly sellCarService: SellCarService) { }

  // Step 1: Get all brands
  @Get('brands')
  async getBrands() {
    const data = await this.sellCarService.findCarBrands();

    return ApiResponseUtil.success(
      CarBrandResource.collection(data),
      'Car brands fetched successfully');
  }

  // // Step 2: Get years by brand
  // @Get('brands/:brandId/years')
  // getYearsByBrand(@Param('brandId') brandId: string) { }

  // // Step 3: Get models by brand & year
  // @Get('brands/:brandId/years/:year/models')
  // getModelsByBrandAndYear(
  //   @Param('brandId') brandId: string,
  //   @Param('year') year: number,
  // ) { }

  // // Step 4: Get variants by model
  // @Get('models/:modelId/variants')
  // getVariantsByModel(@Param('modelId') modelId: string) { }

  // // Final: Submit car for selling
  // @Post()
  // submitCarForSale(@Body() dto: CreateSellCarDto) { }

}
