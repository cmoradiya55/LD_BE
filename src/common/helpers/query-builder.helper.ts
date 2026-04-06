// src/common/helpers/query-builder.helper.ts

import { SelectQueryBuilder, Brackets } from 'typeorm';
import { FilterConfig, FilterOperator } from '@repository/used-car/config/used-car-query.filter.config';
import { SortConfig } from '@repository/used-car/config/used-car-query.sort.config';


export class QBHelper {
    /**
     * Apply filters to query builder based on configuration
     */
    static applyFilters(
        queryBuilder: SelectQueryBuilder<any>,
        params: Record<string, any>,
        filterConfig: FilterConfig[],
    ): void {
        filterConfig.forEach(({ field, column, operator }) => {
            const value = params[field];

            if (value === undefined || value === null) {
                return;
            }

            // Skip empty arrays
            if (Array.isArray(value) && value.length === 0) {
                return;
            }

            this.applyFilterCondition(queryBuilder, field, column, operator, value);
        });
    }

    /**
     * Apply single filter condition
     */
    private static applyFilterCondition(
        queryBuilder: SelectQueryBuilder<any>,
        paramName: string,
        column: string,
        operator: FilterOperator,
        value: any,
    ): void {
        switch (operator) {
            case 'eq':
                queryBuilder.andWhere(`${column} = :${paramName}`, { [paramName]: value });
                break;
            case 'gte':
                queryBuilder.andWhere(`${column} >= :${paramName}`, { [paramName]: value });
                break;
            case 'lte':
                queryBuilder.andWhere(`${column} <= :${paramName}`, { [paramName]: value });
                break;
            case 'in':
                queryBuilder.andWhere(`${column} IN (:...${paramName})`, { [paramName]: value });
                break;
        }
    }

    /**
     * Apply search across multiple columns
     */
    static applySearch(
        queryBuilder: SelectQueryBuilder<any>,
        search: string | undefined,
        searchColumns: string[],
    ): void {
        if (!search?.trim() || searchColumns.length === 0) {
            return;
        }

        const searchTerm = `%${search.trim()}%`;

        queryBuilder.andWhere(
            new Brackets((qb) => {
                searchColumns.forEach((column, index) => {
                    if (index === 0) {
                        qb.where(`${column} ILIKE :search`, { search: searchTerm });
                    } else {
                        qb.orWhere(`${column} ILIKE :search`, { search: searchTerm });
                    }
                });
            }),
        );
    }

    /**
     * Apply OR condition filter (e.g., safety rating from multiple columns)
     */
    static applyOrFilter(
        queryBuilder: SelectQueryBuilder<any>,
        paramName: string,
        columns: string[],
        value: any[] | undefined,
    ): void {
        if (!value || value.length === 0 || columns.length === 0) {
            return;
        }

        queryBuilder.andWhere(
            new Brackets((qb) => {
                columns.forEach((column, index) => {
                    if (index === 0) {
                        qb.where(`${column} IN (:...${paramName})`, { [paramName]: value });
                    } else {
                        qb.orWhere(`${column} IN (:...${paramName})`, { [paramName]: value });
                    }
                });
            }),
        );
    }

    /**
     * Apply sorting based on configuration
     */
    static applySorting(
        queryBuilder: SelectQueryBuilder<any>,
        sortConfigs: SortConfig[],
    ): void {
        if (!sortConfigs || sortConfigs.length === 0) {
            return;
        }

        sortConfigs.forEach((config, index) => {
            if (index === 0) {
                queryBuilder.orderBy(config.column, config.order);
            } else {
                queryBuilder.addOrderBy(config.column, config.order);
            }
        });
    }

    /**
     * Extract total count from data and clean results
     */
    static extractTotalAndCleanData<T extends { totalCount?: string }>(
        data: T[],
    ): { cleanedData: Omit<T, 'totalCount'>[]; total: number } {
        const total = data.length > 0 ? parseInt(data[0].totalCount || '0', 10) : 0;
        const cleanedData = data.map(({ totalCount, ...rest }) => rest) as Omit<T, 'totalCount'>[];

        return { cleanedData, total };
    }
}