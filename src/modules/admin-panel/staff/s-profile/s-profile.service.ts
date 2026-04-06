import { BaseService } from '@common/base/base.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@repository/user/user.repository';

@Injectable()
export class SProfileService {
    constructor(
        private readonly baseService: BaseService,
        private readonly userRepo: UserRepository,
    ) { }

    /**
        * Get manager profile
        */
    async getProfile(staffId: number) {
        return this.baseService.catch(async () => {
            const staff = await this.userRepo.findById(staffId);

            if (!staff) {
                throw new NotFoundException('User not found');
            }

            return staff;
        });
    }
}
