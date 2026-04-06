import { BaseService } from '@common/base/base.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@repository/user/user.repository';

@Injectable()
export class MProfileService {
    constructor(
        private readonly baseService: BaseService,
        private readonly userRepo: UserRepository,
    ) { }

    /**
        * Get manager profile
        */
    async getProfile(managerId: number) {
        return this.baseService.catch(async () => {
            const manager = await this.userRepo.findById(managerId);

            if (!manager) {
                throw new NotFoundException('User not found');
            }

            return manager;
        });
    }
}
