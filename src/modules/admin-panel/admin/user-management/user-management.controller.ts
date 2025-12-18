import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UserRole } from '@common/enums/user.enum';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { AdminCreateUserDto } from './dto/create-user.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { GetAllUsersResource } from './resource/get-all-users.resource';
import { ToggleUserStatusDto } from './dto/toggle-user-status.dto';

@Controller(`${MODULE_PREFIX.ADMIN}/user-management`)
@Roles(UserRole.ADMIN)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) { }

  @Post('create-user')
  async createUser(
    @CurrentUser() user: User,
    @Body() body: AdminCreateUserDto
  ) {
    await this.userManagementService.createUser(user, body);
    return ApiResponseUtil.created(
      'User created successfully',
    );
  }

  @Get('users')
  async testEndpoint(
    @Query() query: GetAllUsersDto,
  ) {
    const { data, page, limit, total } = await this.userManagementService.getAllUsers(query);
    return ApiResponseUtil.paginated(
      'Users fetched successfully',
      // data,
      GetAllUsersResource.collection(data),
      page,
      limit,
      total,
    );
  }

  @Patch('users/:id/toggle-active')
  async toggleUserActiveStatus(
    @CurrentUser('id') userId: number,
    @Param() dto: ToggleUserStatusDto,
  ) {
    await this.userManagementService.toggleUserActiveStatus(userId, dto);
    return ApiResponseUtil.success('Status toggled successfully');
  }
}
