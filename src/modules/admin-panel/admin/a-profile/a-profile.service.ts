import { BaseService } from '@common/base/base.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@repository/user/user.repository';

@Injectable()
export class AProfileService {
    constructor(
        private readonly baseService: BaseService,
        private readonly userRepo: UserRepository,
    ) { }

    /**
        * Get admin profile
        */
    async getProfile(adminId: number) {
        return this.baseService.catch(async () => {
            const admin = await this.userRepo.findById(adminId);

            if (!admin) {
                throw new NotFoundException('User not found');
            }

            return admin;
        });
    }
}
