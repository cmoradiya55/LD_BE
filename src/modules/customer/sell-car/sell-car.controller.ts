import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SellCarService } from './sell-car.service';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { CitySuggestionDto } from './dto/city-suggestion.dto';
import { PincodeCitySuggestionResource } from './resources/pincode-city-suggestion.resource';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateSellCarDto } from './dto/create-sell-car.dto';

@Controller(`${MODULE_PREFIX.CUSTOMER}/sell-car`)
export class SellCarController {
  constructor(private readonly sellCarService: SellCarService) { }

  @Get('city-suggestions')
  async getCitySuggestions(@Query() queryDto: CitySuggestionDto) {
    const { data, total, page, limit } = await this.sellCarService.getCitySuggestions(queryDto);
    return ApiResponseUtil.paginated(
      PincodeCitySuggestionResource.collection(data),
      page,
      limit,
      total,
      'City suggestions fetched successfully'
    );
  }

  // Final: Submit car for selling
  @Post()
  async submitCarForSale(@CurrentUser() user: any, @Body() dto: CreateSellCarDto) {
    await this.sellCarService.submitCarForSale(user, dto);
    return ApiResponseUtil.created(
      'Your request has been submitted successfully. Our team will contact you shortly.'
    );
  }
}
