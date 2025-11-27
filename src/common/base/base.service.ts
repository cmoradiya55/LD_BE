import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { QueryRunner } from 'typeorm/browser';

@Injectable()
export class BaseService {
  protected readonly logger = new Logger(BaseService.name);

  constructor(protected readonly dataSource: DataSource) { }

  async catch<T>(
    callback: (manager: EntityManager) => Promise<T>,
    useTransaction: boolean = false,
  ): Promise<T> {
    if (!useTransaction) {
      return await callback(this.dataSource.manager);
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // /**
  //  * Global try/catch wrapper for service methods
  //  * Handles transactions automatically and ensures proper error propagation
  //  */
  // protected async catch<T>(
  //   callback: (manager: EntityManager) => Promise<T>,
  //   useTransaction: boolean = false,
  // ): Promise<T> {
  //   try {
  //     if (useTransaction) {
  //       return await this.dataSource.transaction(async (manager) => {
  //         return await callback(manager);
  //       });
  //     }

  //     // Without transaction → use default manager
  //     return await callback(this.dataSource.manager);
  //   } catch (error) {
  //     this.logger.error('Service operation failed:', error);
  //     throw error;
  //   }
  // }
}
