import { City } from '@entity/general/city.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { InspectionCentre } from '@entity/inapection-centre/inspection-centre.entity';

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
        await repo.save(inspectionCentre);
        return inspectionCentre;
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
}