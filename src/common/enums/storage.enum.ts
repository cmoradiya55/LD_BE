// 1. All the possible things a user/inspector can upload
export enum MediaCategory {
    // Car Visuals
    CAR = 'car',
    IMAGE = 'image',
    DOCUMENT = 'document',

    // Sensitive Docs
    SENSITIVE_DOCUMENT = 'sensitive_document',
}

export enum VideoCategory {
    INSPECTION_VIDEO = 'inspection_video',
}

// 2. The Zones
export enum SecurityZone {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

// 3. THE MAP: This determines the logic. 
// If you want to make RC Books public later, you change ONE line here.
export const MEDIA_ZONE_MAP: Record<MediaCategory | VideoCategory, SecurityZone> = {
    // Public Stuff
    [MediaCategory.CAR]: SecurityZone.PUBLIC,
    [MediaCategory.IMAGE]: SecurityZone.PUBLIC,
    [MediaCategory.DOCUMENT]: SecurityZone.PUBLIC,

    // Private Stuff (STRICT)
    [MediaCategory.SENSITIVE_DOCUMENT]: SecurityZone.PRIVATE,
    [VideoCategory.INSPECTION_VIDEO]: SecurityZone.PRIVATE,
};

// ✅ Define which categories are videos
export const VIDEO_CATEGORIES = [
    VideoCategory.INSPECTION_VIDEO,
];