import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    private readonly s3: S3Client;
    private readonly bucket: string;
    private readonly region: string;

    constructor(private readonly config: ConfigService) {
        this.region = this.config.getOrThrow<string>('aws.region');
        this.bucket = this.config.getOrThrow<string>('aws.bucket');
        const accessKeyId = this.config.getOrThrow<string>('aws.access_key_id');
        const secretAccessKey = this.config.getOrThrow<string>('aws.secret_access_key');


        this.s3 = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    /**
     * Generates a Pre-Signed PUT URL.
     * STRICT: It signs the Content-Type. If the frontend tries to upload
     * a different file type than what was requested, S3 will reject it.
     */
    // async generatePresignedUrl(key: string, contentType: string): Promise<{ url: string; key: string }> {
    async signUrl(key: string, contentType: string): Promise<any> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                ContentType: contentType,
                // Enforcing Cache-Control metadata for better frontend performance
                CacheControl: 'max-age=31536000',
            });

            // Url expires in 2 minutes (120 seconds)
            const url = await getSignedUrl(this.s3, command, { expiresIn: 120 });

            return { url, key };
        } catch (error) {
            console.error('S3 Signing Error:', error);
            throw new InternalServerErrorException('Could not generate upload URL');
        }
    }
}