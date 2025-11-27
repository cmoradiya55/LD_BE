import { LogLevel } from '@nestjs/common';

export function getLogLevels(): LogLevel[] {
    const env = process.env.NODE_ENV || 'development';

    if (env === 'production') {
        // In production you don't want spam logs
        return ['log', 'warn', 'error'];
    }

    // Default for local/dev
    return ['log', 'error', 'warn', 'debug', 'verbose'];
}
