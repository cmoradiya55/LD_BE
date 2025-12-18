import { User } from '@entity/user/user.entity';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { AdminCreateUserDto } from './dto/create-user.dto';
import { BaseService } from '@common/base/base.service';
import { UserRepository } from '@repository/user/user.repository';
import { CityRepository } from '@repository/general/city.repository';
import { UserRole } from '@common/enums/user.enum';
import { EntityManager } from 'typeorm';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { ToggleUserStatusDto } from './dto/toggle-user-status.dto';

@Injectable()
export class UserManagementService {
    constructor(
        private readonly baseService: BaseService,
        private readonly userRepo: UserRepository,
        private readonly cityRepo: CityRepository,
    ) { }

    async createUser(adminUser: User, createUserDto: AdminCreateUserDto): Promise<void> {
        return this.baseService.catch(async (manager) => {
            const {
                roleId,
                name,
                countryCode,
                mobileNo,
                cityId,
                managerId,
            } = createUserDto;

            // ✅ Parallel validation queries (run simultaneously)
            const [existingUser, cityValid, managerUser] = await Promise.all([
                // 1. Check duplicate mobile
                this.userRepo.findByMobileRaw(countryCode, mobileNo, manager),

                // 2. Validate city (only if provided - DTO ensures it's required for non-admin)
                this.shouldValidateCity(roleId, cityId, manager),

                // 3. Validate manager (only if inspector or staff)
                managerId
                    ? this.userRepo.findActiveUserById(managerId, manager)
                    : Promise.resolve(null),
            ]);

            // Validate results
            if (existingUser) {
                throw new ConflictException('User with same mobile number already exists');
            }

            if (cityId && !cityValid) {
                throw new BadRequestException('We do not operate in the selected city at the moment.');
            }

            // Validate manager based on role
            if (roleId === UserRole.INSPECTOR) {
                if (!managerUser || managerUser.role !== UserRole.MANAGER || managerUser.city_id !== cityId) {
                    throw new BadRequestException('Inspector must be assigned to a Manager in the same city');
                }
            } else if (roleId === UserRole.STAFF) {
                if (!managerUser || managerUser.role !== UserRole.ADMIN) {
                    throw new BadRequestException('Staff must be assigned to an Admin');
                }
            }

            // Create user
            await this.userRepo.createAndSave({
                role: roleId,
                name,
                country_code: countryCode,
                mobile_number: mobileNo,
                city_id: roleId !== UserRole.ADMIN ? cityId : null,
                manager_id: managerUser?.id || null,
                is_active: true,
                is_email_verified: false,
                is_mobile_verified: false,
                created_by: adminUser.id,
            } as User, manager);

        }, true);
    }

    /* Get all users with pagination and filters */
    async getAllUsers(query: GetAllUsersDto) {
        return this.baseService.catch(async () => {
            const { page, limit } = query;
            const result = await this.userRepo.getAllUsers(query, page, limit);
            return result;
        })
    }

    async toggleUserActiveStatus(
        userId: number,
        dto: ToggleUserStatusDto,
    ): Promise<void> {
        return this.baseService.catch(async (manager) => {
            const { id } = dto;
            if (userId === id) {
                throw new BadRequestException('You cannot change your own status');
            }

            const user = await this.userRepo.findById(id, manager);
            if (!user) throw new BadRequestException('User not found');

            user.is_active = !user.is_active;
            user.updated_by = userId;
            user.updated_at = new Date();
            await this.userRepo.save(user, manager);
        });
    }

    private async shouldValidateCity(
        roleId: UserRole,
        cityId: number | undefined,
        manager?: EntityManager,
    ): Promise<boolean> {
        // Admin doesn't need city
        if (roleId === UserRole.ADMIN) {
            return Promise.resolve(true);
        }

        // Non-admin roles must have valid city
        if (!cityId) {
            return Promise.resolve(false); // ❌ Missing city
        }

        // Validate city exists and is active
        return await this.cityRepo.isCityIdValid(cityId, manager);
    }
}
