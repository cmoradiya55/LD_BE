import { InspectionImageBaseDto } from "@common/dto/inspection-image-base.dto";
import { IMAGE_SUBTYPE_NAMES } from "@common/providers/inspection-image/enum/inspection-image.enum";
import { InspectionImage } from "@entity/used-car/inspection-image.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class InspectionImageRepository {
    constructor(
        @InjectRepository(InspectionImage)
        private readonly inspectionImageRepository: Repository<InspectionImage>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<InspectionImage> {
        return manager ? manager.getRepository(InspectionImage) : this.inspectionImageRepository;
    }

    async saveImagesUpsert(
        vehicleId: number,
        inspectorId: number,
        images: InspectionImageBaseDto[],
        manager?: EntityManager,
    ): Promise<void> {
        if (!images.length) return;

        const repo = this.getRepo(manager);

        const values = images.map(img => ({
            vehicle_id: vehicleId,
            inspector_id: inspectorId,
            image_type: img.type,
            image_subtype: img.sub_type,
            title: IMAGE_SUBTYPE_NAMES[img.type]?.[img.sub_type] || null,
            image_url: img.image_url,
            has_damage: img.is_damage || false,
            remarks: img.remarks || undefined,
            is_active: true,
        }));

        await repo.upsert(values, {
            conflictPaths: ['vehicle_id', 'image_type', 'image_subtype'],
            skipUpdateIfNoValuesChanged: true, // Skip if no changes
        });
    }
}
