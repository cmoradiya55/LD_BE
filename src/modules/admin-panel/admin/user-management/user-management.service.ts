import { User } from '@entity/user/user.entity';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { AdminCreateUserDto } from './dto/create-user.dto';
import { BaseService } from '@common/base/base.service';
import { UserRepository } from '@repository/user/user.repository';
import { UserRole } from '@common/enums/user.enum';
import { EntityManager } from 'typeorm';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { ToggleUserStatusDto } from './dto/toggle-user-status.dto';
import { InspectionCentreRepository } from '@repository/inspection-centre/inspection-centre.repository';
import { GetInspectorByManagerDto, GetInspectorByManagerQueryDto } from './dto/get-inspector.dto';
import { VerifyUserDocumentsDto } from './dto/verify-user-document.dto';

@Injectable()
export class UserManagementService {
    constructor(
        private readonly baseService: BaseService,
        private readonly userRepo: UserRepository,
        private readonly inspectionCentreRepo: InspectionCentreRepository,
    ) { }

    async createUser(adminUser: User, createUserDto: AdminCreateUserDto): Promise<void> {
        return this.baseService.catch(async (manager) => {
            const {
                roleId,
                name,
                countryCode,
                mobileNo,
                inspectionCentreId,
                managerId,
            } = createUserDto;

            // ✅ Parallel validation queries (run simultaneously)
            const [existingUser, inspectionCentreValid, managerUser] = await Promise.all([
                // 1. Check duplicate mobile
                this.userRepo.findByMobileRaw(countryCode, mobileNo, manager),

                // 2. Validate inspection centre (only if provided - DTO ensures it's required for non-admin)
                this.shouldValidateInspectionCentre(roleId, inspectionCentreId, manager),

                // 3. Validate manager (only if inspector or staff)
                managerId
                    ? this.userRepo.findActiveUserById(managerId, manager)
                    : Promise.resolve(null),
            ]);

            // Validate results
            if (existingUser) {
                throw new ConflictException('User with same mobile number already exists');
            }

            if (inspectionCentreId && !inspectionCentreValid) {
                throw new BadRequestException('We do not operate in the selected inspection centre at the moment.');
            }

            // check that is new manager entry valid according to contraint defined(eg. one inspection centre have only one manager )
            if (roleId === UserRole.MANAGER) {
                const isManagerLimitExceeded = await this.userRepo.isManagerLimitExceededInInspectionCentre(inspectionCentreId, manager);
                if (isManagerLimitExceeded) {
                    throw new BadRequestException(`Inspection Centre can have maximum allowed managers. Cannot add more managers to this inspection centre.`);
                }
            }

            // Validate manager based on role
            if (roleId === UserRole.INSPECTOR) {
                if (!managerUser || managerUser.role !== UserRole.MANAGER) {
                    throw new BadRequestException('Inspector must be assigned to a Manager');
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
                inspection_centre_id: roleId !== UserRole.ADMIN ? inspectionCentreId : null,
                manager_id: (roleId !== UserRole.ADMIN && roleId !== UserRole.MANAGER) ? managerUser?.id || null : null,
                is_active: true,
                is_email_verified: false,
                is_mobile_verified: false,
                created_by: adminUser.id,
            } as User, manager);

        }, true);
    }

    async getInspectorsByManagerId(param: GetInspectorByManagerDto, query: GetInspectorByManagerQueryDto) {
        return this.baseService.catch(async () => {
            const { managerId } = param;
            const { page, limit } = query;
            const isManager = await this.userRepo.isManagerExists(managerId);
            if (!isManager) {
                throw new BadRequestException('Manager not found');
            }
            const result = await this.userRepo.getInspectorsByManagerId(managerId, page, limit);
            return result;
        });
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

    async verifyUserDocuments(
        user: User,
        dto: VerifyUserDocumentsDto,
    ): Promise<void> {
        return this.baseService.catch(async () => {
            const {
                userId,
                remarks,
                status,
            } = dto;
            if (user.id === userId) {
                throw new BadRequestException('You cannot verify your own documents');
            }

            const updated = await this.userRepo.verifyOrRejectUserDocuments(
                userId,
                status,
                remarks,
                user.id
            );
            if (!updated.affected) {
                throw new BadRequestException(
                    'User not found or no pending documents to verify',
                );
            }
        });
    }

    private async shouldValidateInspectionCentre(
        roleId: UserRole,
        inspectionCentreId: number | undefined,
        manager?: EntityManager,
    ): Promise<boolean> {
        // Admin doesn't need city
        if (roleId === UserRole.ADMIN) {
            return Promise.resolve(true);
        }

        // Non-admin roles must have valid inspection centre
        if (!inspectionCentreId) {
            return Promise.resolve(false); // ❌ Missing inspection centre
        }

        // Validate inspection centre exists and is active
        return await this.inspectionCentreRepo.isInspectionCentreIdValid(inspectionCentreId, manager);
    }
}
