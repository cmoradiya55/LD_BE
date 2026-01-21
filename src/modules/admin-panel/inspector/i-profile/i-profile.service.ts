import { BaseService } from '@common/base/base.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@repository/user/user.repository';

@Injectable()
export class IProfileService {
    constructor(
        private readonly baseService: BaseService,
        private readonly userRepo: UserRepository,
    ) { }

    /**
        * Get inspector profile
        */
    async getProfile(inspectorId: number) {
        return this.baseService.catch(async () => {
            const inspector = await this.userRepo.findById(inspectorId);
            if (!inspector) {
                throw new NotFoundException('User not found');
            }

            return inspector;
        });
    }
}
