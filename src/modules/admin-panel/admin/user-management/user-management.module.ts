import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [UserManagementController],
  providers: [UserManagementService],
})
export class UserManagementModule { }
