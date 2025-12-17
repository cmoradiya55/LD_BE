import { adminJwtConfig } from "./admin-jwt.config";
import { appConfig } from "./app.config";
import { awsConfig } from "./aws.config";
import { dbConfig } from "./db.config";
import { customerJwtConfig } from "./jwt.config";
import { mailConfig } from "./mail.config";
import { redisConfig } from "./redis.config";

export default [
    appConfig,
    dbConfig,
    awsConfig,
    redisConfig,
    mailConfig,
    customerJwtConfig,
    adminJwtConfig
];