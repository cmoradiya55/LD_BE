import { BaseService } from '@common/base/base.service';
import { User } from '@entity/user/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetInspectorQueryDto } from './dto/get-inspector.dto';
import { UserRepository } from '@repository/user/user.repository';
import { ToggleInspectorStatusDto } from './dto/toggle-inspector-status.dto';

@Injectable()
export class MUserManagementService {
    constructor(
        private readonly baseService: BaseService,
        private readonly userRepo: UserRepository,
    ) { }

    async getInspectors(
        user: User,
        query: GetInspectorQueryDto,
    ) {
        return this.baseService.catch(async () => {
            const { id: managerId } = user;
            const { page, limit } = query;

            const result = await this.userRepo.getInspectorsByManagerId(managerId, page, limit);
            return result;
        });
    }


    async toggleInspectorStatus(
        managerId: number,
        dto: ToggleInspectorStatusDto,
    ): Promise<void> {
        return this.baseService.catch(async () => {
            const { id } = dto;
            const user = await this.userRepo.checkInspectorExistsUnderManager(id, managerId);
            if (!user) throw new BadRequestException('Inspector not found');

            user.is_active = !user.is_active;
            user.updated_by = managerId;
            user.updated_at = new Date();
            await this.userRepo.save(user);
        });
    }
}
