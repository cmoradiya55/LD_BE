import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsedCarService } from './used-car.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UsedCarListingDto } from './dto/used-car-listing.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { UsedCarListingResource } from './resources/used-car-listing.resource';
import { UsedCarDetailParamDto } from './dto/used-car-detail.dto';
import { UsedCarDetailResource } from './resources/used-car-detail.resource';
import { OptionalAuthGuard } from '../c-auth/guards/jwt-optional-c-auth.guard';
import { Customer } from '@entity/customer/customer.entity';
import { OptionalUser } from '@common/decorators/optional-user.decorator';

@Controller(`${MODULE_PREFIX.CUSTOMER}/used-car`)
export class UsedCarController {
  constructor(private readonly usedCarService: UsedCarService) { }

  @Get()
  @UseGuards(OptionalAuthGuard)
  async getUsedCars(
    @Query() query: UsedCarListingDto,
    @OptionalUser() customer: Customer | null,
  ) {
    const { data, page, total, limit } = await this.usedCarService.findUsedCars(query, customer?.id);
    return ApiResponseUtil.paginated(
      'Cars fetched successfully',
      UsedCarListingResource.collection(data),
      page,
      limit,
      total,
    );
  }

  @Get(':slug')
  async getUsedCarDetailBySlug(@Param() params: UsedCarDetailParamDto) {
    const data = await this.usedCarService.getUsedCarDetailBySlug(params);
    return ApiResponseUtil.success(
      'Car details fetched successfully',
      new UsedCarDetailResource(data),
    );
  }
}
