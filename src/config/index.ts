import { adminJwtConfig } from "./admin-jwt.config";
import { adminSettingConfig } from "./admin-setting.config";
import { appConfig } from "./app.config";
import { awsConfig } from "./aws.config";
import { dbConfig } from "./db.config";
import { inspectionCentreConfig } from "./inspection-centre.config";
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
    adminJwtConfig,
    adminSettingConfig,
    inspectionCentreConfig,
];