import { Module } from '@nestjs/common';
import { MUserManagementService } from './user-management.service';
import { MUserManagementController } from './user-management.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [MUserManagementController],
  providers: [MUserManagementService],
})
export class MUserManagementModule {}
