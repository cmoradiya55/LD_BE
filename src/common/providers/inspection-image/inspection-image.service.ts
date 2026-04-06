// =============================================
// services/inspection-image.service.ts
// Standalone image service
// =============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageQueryOptions, ImageSection, InspectionImageQueryHelper, ProcessedImage } from './helper/inspection-image.helper';
import { InspectionImage } from '@entity/used-car/inspection-image.entity';

@Injectable()
export class InspectionImageService {
    constructor(
        @InjectRepository(InspectionImage)
        private readonly repo: Repository<InspectionImage>,
    ) { }

    /**
     * Get images for single vehicle
     */
    async getImages(
        vehicleId: number,
        applyWhitelist: boolean = true
    ): Promise<ProcessedImage[]> {
        const qb = this.repo.createQueryBuilder('img');
        InspectionImageQueryHelper.applyFilters(qb, { vehicleId, applyWhitelist });

        const raw = await qb.getMany();
        return InspectionImageQueryHelper.processImages(raw, applyWhitelist);
    }

    /**
     * Get images grouped by section
     */
    async getImagesBySection(
        vehicleId: number,
        applyWhitelist: boolean = true
    ): Promise<ImageSection[]> {
        const images = await this.getImages(vehicleId, applyWhitelist);
        return InspectionImageQueryHelper.groupBySection(images);
    }

    /**
     * Get images for multiple vehicles
     */
    async getImagesBulk(
        vehicleIds: number[],
        applyWhitelist: boolean = true
    ): Promise<Map<number, ProcessedImage[]>> {
        if (!vehicleIds.length) return new Map();

        const qb = this.repo.createQueryBuilder('img');
        InspectionImageQueryHelper.applyFilters(qb, { vehicleIds, applyWhitelist });

        const raw = await qb.getMany();
        return InspectionImageQueryHelper.processImagesByVehicle(raw, applyWhitelist);
    }

    /**
     * Generic method with full options
     */
    async query(options: ImageQueryOptions): Promise<ProcessedImage[]> {
        const qb = this.repo.createQueryBuilder('img');
        InspectionImageQueryHelper.applyFilters(qb, options);

        const raw = await qb.getMany();
        return InspectionImageQueryHelper.processImages(raw, options.applyWhitelist ?? true);
    }
}