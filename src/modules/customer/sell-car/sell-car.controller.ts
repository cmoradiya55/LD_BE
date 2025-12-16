import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SellCarService } from './sell-car.service';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { CitySuggestionDto } from './dto/city-suggestion.dto';
import { PincodeCitySuggestionResource } from './resources/pincode-city-suggestion.resource';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateSellCarDto } from './dto/create-sell-car.dto';
import { CJwtAuthGuard } from '../c-auth/guards/jwt-c-auth.guard';
import { Customer } from '@entity/customer/customer.entity';

@Controller(`${MODULE_PREFIX.CUSTOMER}/sell-car`)
export class SellCarController {
  constructor(private readonly sellCarService: SellCarService) { }

  @Get('city-suggestions')
  async getCitySuggestions(@Query() queryDto: CitySuggestionDto) {
    const { data, total, page, limit } = await this.sellCarService.getCitySuggestions(queryDto);
    return ApiResponseUtil.paginated(
      'City suggestions fetched successfully',
      PincodeCitySuggestionResource.collection(data),
      page,
      limit,
      total,
    );
  }

  // Final: Submit car for selling
  @Post()
  @UseGuards(CJwtAuthGuard)
  async submitCarForSale(@CurrentUser() customer: Customer, @Body() dto: CreateSellCarDto) {
    await this.sellCarService.submitCarForSale(customer, dto);
    return ApiResponseUtil.created(
      'Your request has been submitted successfully. Our team will contact you shortly.'
    );
  }
}
