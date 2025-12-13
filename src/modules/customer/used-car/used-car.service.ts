import { BaseService } from '@common/base/base.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { UsedCarListingDto } from './dto/used-car-listing.dto';
import { UsedCarDetailParamDto } from './dto/used-car-detail.dto';
import { CustomerUsedCarListingDto } from './dto/customer-used-car-listing.dto';
import { Customer } from '@entity/customer/customer.entity';
import { MyUsedCarDetailParamDto } from './dto/my-used-car-detail.dto';
import { UpdateMyUsedCarDetailParamDto, UpdateMyUsedCarDto } from './dto/update-my-used-car.dto';
import { PincodeRepository } from '@repository/general/pincode.repository';
import { WHITELISTED_STATUS_FOR_UPDATE_MY_USED_CAR_DETAIL } from '@common/constants/used-car.constant';

@Injectable()
export class UsedCarService {
    constructor(
        private readonly baseService: BaseService,
        private readonly usedCarRepository: UsedCarRepository,
        private readonly pincodeRepository: PincodeRepository,
    ) { }

    /**
     * Get used cars list with filters and pagination
     */
    async findUsedCars(
        query: UsedCarListingDto,
        customerId?: number,
    ) {
        return this.baseService.catch(async () => {
            const result = await this.usedCarRepository.findUsedCars(query, customerId);

            return result;
        })
    }

    async getUsedCarDetailBySlug(params: UsedCarDetailParamDto) {
        return this.baseService.catch(async () => {
            const { slug } = params;

            const result = await this.usedCarRepository.getUsedCarDetailBySlug(slug);

            return result;
        })
    }

    /**
    * Get customer used cars list with filters and pagination
    */
    async getCustomerUsedCars(
        customerId: number,
        query: CustomerUsedCarListingDto,
    ) {
        return this.baseService.catch(async () => {
            const { page, limit } = query;
            const result = await this.usedCarRepository.findUsedCarByCustomer(customerId, page, limit);
            return result;
        })
    }

    /**
    * Get customer used car detail by id
    */
    async getMyUsedCarDetailById(
        customer: Customer,
        dto: MyUsedCarDetailParamDto,
    ) {
        return this.baseService.catch(async () => {
            const { id } = dto;
            const result = await this.usedCarRepository.getUsedCarDetailByCustomer(customer.id, id);
            return result;
        })
    }


    async updateMyUsedCarById(
        customer: Customer,
        params: UpdateMyUsedCarDetailParamDto,
        dto: UpdateMyUsedCarDto,
    ) {
        return this.baseService.catch(async () => {
            const { id } = params;
            const { pincode_id, km_driven_range } = dto;

            const usedCar = await this.usedCarRepository.getBasicUsedCarDetailsWithPincodeByIdAndCustomer(id, customer.id);
            if (!usedCar) throw new BadRequestException('Car not found');

            if (!WHITELISTED_STATUS_FOR_UPDATE_MY_USED_CAR_DETAIL.includes(usedCar.status)) {
                throw new BadRequestException('Only cars with pending inspection status can be updated');
            }

            if (usedCar.pincode_id === pincode_id) {
                await this.usedCarRepository.updateMyUsedCarById(customer.id, id, {
                    km_driven_range,
                    updated_at: new Date(),
                });
                return;
            }

            if (!usedCar.pincode.city_id) throw new BadRequestException('Current pincode city information is missing');

            const isPincodevalid = await this.pincodeRepository.isPincodeBelongsToCity(pincode_id, usedCar.pincode.city_id);
            if (!isPincodevalid) throw new BadRequestException('The provided pincode is invalid');

            await this.usedCarRepository.updateMyUsedCarById(customer.id, id, {
                pincode_id,
                km_driven_range,
                updated_at: new Date(),
            })
        })
    }
}
