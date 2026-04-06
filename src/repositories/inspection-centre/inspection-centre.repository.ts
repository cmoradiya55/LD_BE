import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { InspectionCentre } from '@entity/inapection-centre/inspection-centre.entity';
import { SORT_ORDER } from '@common/constants/app.constant';

@Injectable()
export class InspectionCentreRepository {
    constructor(
        @InjectRepository(InspectionCentre)
        private readonly repo: Repository<InspectionCentre>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<InspectionCentre> {
        return manager ? manager.getRepository(InspectionCentre) : this.repo;
    }

    /**
       * Create new user
       */
    create(data: InspectionCentre, manager?: EntityManager): InspectionCentre {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    async save(entity: InspectionCentre, manager?: EntityManager): Promise<InspectionCentre> {
        const repo = this.getRepo(manager);
        entity.updated_at = new Date();
        return await repo.save(entity);
    }

    async createAndSave(data: InspectionCentre, manager?: EntityManager): Promise<InspectionCentre> {
        const repo = this.getRepo(manager);
        const inspectionCentre = repo.create(data);
        inspectionCentre.updated_at = new Date();
        await repo.save(inspectionCentre);
        return inspectionCentre;
    }

    async updateById(id: number, data: Partial<InspectionCentre>, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        data.updated_at = new Date();
        await repo.update({ id }, data);
    }

    async findByPincodeAndCity(pincodeId: number, cityId: number, manager?: EntityManager): Promise<InspectionCentre | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                pincode_id: pincodeId,
                city_id: cityId,
            }
        });
    }

    async isInspectionCentreIdValid(inspectionCentreId: number, manager?: EntityManager): Promise<boolean> {
        const repo = this.getRepo(manager);
        const count = await repo.count({
            where: {
                id: inspectionCentreId,
                is_active: true,
            }
        });
        return count > 0;
    }

    async getAll(manager?: EntityManager): Promise<InspectionCentre[]> {
        const repo = this.getRepo(manager);
        return await repo.find({
            relations: ['createdByUser', 'updatedByUser', 'city', 'pincode'],
            order: {
                id: SORT_ORDER.DESC,
            },
        });
    }

    async findById(id: number, manager?: EntityManager): Promise<InspectionCentre | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: { id },
            relations: ['createdByUser', 'updatedByUser', 'city', 'pincode'],
        });
    }
}