import { Controller, Get, Query } from '@nestjs/common';
import { UsedCarService } from './used-car.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UsedCarListingDto } from './dto/used-car-listing.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { UsedCarListingResource } from './resources/used-car-listing.resource';

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
    return data;
  }

}
