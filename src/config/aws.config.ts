import { registerAs } from "@nestjs/config";

export const awsConfig = registerAs('aws', () => ({
    region: process.env.AWS_REGION,
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_S3_BUCKET,
    base_url: process.env.AWS_S3_PUBLIC_BASE_URL,
    use_path_style_endpoint: process.env.AWS_USE_PATH_STYLE_ENDPOINT,
}));
