import { Controller, Get, Query } from '@nestjs/common';
import { UsedCarService } from './used-car.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UsedCarListingDto } from './dto/used-car-listing.dto';

@Controller(`${MODULE_PREFIX.CUSTOMER}/used-car`)
export class UsedCarController {
  constructor(private readonly usedCarService: UsedCarService) { }

  @Get()
  async getUsedCars(@Query() query: UsedCarListingDto) {
    const data = await this.usedCarService.findUsedCars(query);
    return data;
  }

}
