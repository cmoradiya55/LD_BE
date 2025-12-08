// src/common/helpers/slug.helper.ts

export class SlugHelper {
    /**
     * Generate slug for a used car
     * Format: used-<brand_slug>-<model_slug>-<variant_slug>-<id>
     *
     * @param brandSlug  - slug from brand table
     * @param modelSlug  - slug from model table
     * @param variantSlug - slug from variant table
     * @param id - used_car id
     * @returns generated slug
     */
    static generateUsedCarSlug(
        brandSlug: string,
        modelSlug: string,
        variantSlug: string,
        id: number,
    ): string {
        if (!brandSlug || !modelSlug || !variantSlug || !id) {
            throw new Error('All parameters are required to generate slug');
        }

        // Normalize slugs: lowercase and remove spaces (optional)
        const normalizedBrand = brandSlug.trim().toLowerCase().replace(/\s+/g, '-');
        const normalizedModel = modelSlug.trim().toLowerCase().replace(/\s+/g, '-');
        const normalizedVariant = variantSlug.trim().toLowerCase().replace(/\s+/g, '-');

        return `used-${normalizedBrand}-${normalizedModel}-${normalizedVariant}-${id}`;
    }
}
