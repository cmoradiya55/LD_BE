import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsedCarService } from './used-car.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UsedCarListingDto } from './dto/used-car-listing.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { UsedCarListingResource } from './resources/used-car-listing.resource';
import { UsedCarDetailParamDto } from './dto/used-car-detail.dto';
import { UsedCarDetailResource } from './resources/used-car-detail.resource';

@Controller(`${MODULE_PREFIX.CUSTOMER}/used-car`)
export class UsedCarController {
  constructor(private readonly usedCarService: UsedCarService) { }

  @Get()
  async getUsedCars(@Query() query: UsedCarListingDto) {
    const { data, page, total, limit } = await this.usedCarService.findUsedCars(query);
    console.log("Used car listing data:", data);
    return ApiResponseUtil.paginated(
      UsedCarListingResource.collection(data),
      page,
      limit,
      total,
      'Cars fetched successfully'
    );
  }

  @Get(':slug')
  async getUsedCarDetailBySlug(@Param() params: UsedCarDetailParamDto) {
    const data = await this.usedCarService.getUsedCarDetailBySlug(params);
    return ApiResponseUtil.success(
      new UsedCarDetailResource(data),
      'Car details fetched successfully'
    );
  }
}
