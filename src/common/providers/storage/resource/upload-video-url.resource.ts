// storage/resource/upload-url.resource.ts
export class UploadVideoUrlResource {
    originalName: string;
    uploadUrl: string;
    key: string;
    contentType: string;
    maxSize?: number;
    maxDuration?: number;
    expiresIn: number;

    static collection(data: any[]) {
        return data.map(item => ({
            originalName: item.originalName,
            uploadUrl: item.uploadUrl,
            key: item.key,
            contentType: item.contentType,
            maxSize: item.maxSize,
            maxDuration: item.maxDuration,
            expiresIn: item.expiresIn,
        }));
    }
}