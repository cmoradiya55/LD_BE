import { BaseService } from '@common/base/base.service';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { UsedCarListingDto } from './dto/used-car-listing.dto';
import { UsedCarDetailParamDto } from './dto/used-car-detail.dto';
import { CustomerUsedCarListingDto } from './dto/customer-used-car-listing.dto';
import { Customer } from '@entity/customer/customer.entity';
import { MyUsedCarDetailParamDto } from './dto/my-used-car-detail.dto';
import { UpdateMyUsedCarDetailParamDto, UpdateMyUsedCarDto } from './dto/update-my-used-car.dto';
import { PincodeRepository } from '@repository/general/pincode.repository';
import { WHITELISTED_STATUS_FOR_UPDATE_MY_USED_CAR_DETAIL } from '@common/constants/used-car.constant';
import { CityRepository } from '@repository/general/city.repository';
import { ApproveOrRejectListingDto, ApproveOrRejectListingParamDto } from './dto/approve-or-reject-listing.dto';
import { CustomerUsedCarApprovalStatus } from '@common/enums/used-car-status.enum';
import { UsedCarListingStatus } from '@common/enums/car-detail.enum';

@Injectable()
export class UsedCarService {
    constructor(
        private readonly baseService: BaseService,
        private readonly usedCarRepository: UsedCarRepository,
        private readonly pincodeRepository: PincodeRepository,
        private readonly cityRepository: CityRepository,
    ) { }

    /**
     * Get used cars list with filters and pagination
     */
    async findUsedCars(
        query: UsedCarListingDto,
        customerId?: number,
    ) {
        return this.baseService.catch(async () => {
            const { cityId } = query;
            const pincodeIds = await this.cityRepository.getPincodeIdsByCityId(cityId);
            if (pincodeIds.length === 0) {
                throw new BadRequestException('No pincodes found for the selected city');
            }
            const result = await this.usedCarRepository.findUsedCars(query, pincodeIds, customerId);
            return result;
        })
    }

    async getUsedCarDetailBySlug(params: UsedCarDetailParamDto, customerId?: number) {
        return this.baseService.catch(async () => {
            const { slug } = params;

            const result = await this.usedCarRepository.getUsedCarDetailBySlug(slug, customerId);
            if (!result) {
                throw new BadRequestException('Car details not found');
            }

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
            if (!result) {
                throw new BadRequestException('Car not found');
            }
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

    /**
        * ✅ Customer approves or cancels their car listing
        */
    async updateUsedCarStatus(
        customer: Customer,
        param: ApproveOrRejectListingParamDto,
        body: ApproveOrRejectListingDto,
    ) {
        return this.baseService.catch(async (manager) => {
            const { id } = param;
            const { status, reason, price } = body;

            // 1. Find car and validate ownership
            const usedCar = await this.usedCarRepository.getCarDettailsOfCustomer(id, customer.id, manager);

            if (!usedCar) {
                throw new BadRequestException('Car not found or you do not own this car');
            }

            // 2. Validate current status allows customer action
            this.validateCustomerCanUpdateStatus(usedCar.status, status, price);

            // 3. Process based on customer action
            if (status === CustomerUsedCarApprovalStatus.APPROVED) {
                await this.usedCarRepository.updateMyUsedCarById(
                    customer.id,
                    usedCar.id,
                    {
                        status: UsedCarListingStatus.LISTED,
                        expected_price: price ? Number(price) : usedCar.expected_price,
                    },
                    manager
                )
                return { message: "Car has been listed successfully" };
            } else if (status === CustomerUsedCarApprovalStatus.CANCELLED) {
                await this.usedCarRepository.updateMyUsedCarById(
                    customer.id,
                    usedCar.id,
                    {
                        status: UsedCarListingStatus.REJECTED_BY_CUSTOMER,
                        rejection_reason: reason?.trim(),

                    },
                    manager
                )
                return { message: "Car listing has been delisted/rejected successfully" };
            } else {
                throw new BadRequestException('Invalid status for update');
            }
        }, true);
    }

    /**
     * ✅ Validate if customer can perform the action based on current status
     */
    private validateCustomerCanUpdateStatus(
        currentStatus: UsedCarListingStatus,
        requestedAction: CustomerUsedCarApprovalStatus,
        price?: number,
    ): void {
        // ✅ Statuses where NO customer action is allowed
        const blockedStatuses = [
            UsedCarListingStatus.SOLD,                    // 900 - Already sold
            UsedCarListingStatus.REJECTED_BY_MANAGER,     // 1000 - Manager rejected
            UsedCarListingStatus.REJECTED_BY_ADMIN,       // 1100 - Admin rejected
            UsedCarListingStatus.EXPIRED,                 // 1300 - Listing expired
            UsedCarListingStatus.CANCELLED,               // 1400 - Already cancelled
        ];

        if (blockedStatuses.includes(currentStatus)) {
            throw new ForbiddenException(
                "You cannot update the status of this car as of now"
            );
        }

        // ✅ For APPROVAL: Only allowed when admin has approved
        if (requestedAction === CustomerUsedCarApprovalStatus.APPROVED) {
            if (currentStatus < UsedCarListingStatus.APPROVED_BY_ADMIN) {
                throw new ForbiddenException(
                    'You can only approve your car listing after admin approval.'
                );
            }

            if (currentStatus === UsedCarListingStatus.LISTED && !price) {
                throw new BadRequestException(
                    'Your car is already listed.'
                );
            }
        } else if (requestedAction === CustomerUsedCarApprovalStatus.CANCELLED) {
            const whitelistedStatusesForDelisting = [
                UsedCarListingStatus.LISTED,
                UsedCarListingStatus.APPROVED_BY_ADMIN,
            ];

            if (currentStatus === UsedCarListingStatus.EXPIRED) {
                throw new BadRequestException(
                    'Your car listing has already expired and delisted.'
                );
            }

            if (currentStatus === UsedCarListingStatus.REJECTED_BY_CUSTOMER) {
                throw new BadRequestException(
                    'Your car listing is already delisted.'
                );
            }

            if (!whitelistedStatusesForDelisting.includes(currentStatus)) {
                throw new ForbiddenException(
                    'You can only delist/reject your car listing when it is listed or approved by admin.'
                );
            }
        } else {
            console.error(`Invalid current status: ${currentStatus}`);
            console.error(`Invalid requested action: ${requestedAction}`);
            throw new BadRequestException('Invalid status for update');
        }
    }
}

