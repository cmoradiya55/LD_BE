import { registerAs } from '@nestjs/config';

export const inspectionCentreConfig = registerAs('inspectionCentre', () => ({
    maxManagers: parseInt(process.env.MAX_MANAGERS_PER_INSPECTION_CENTRE || '1', 10),
}));