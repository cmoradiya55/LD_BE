import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        @Inject('WINSTON_MODULE_NEST_PROVIDER') private readonly logger: WinstonLogger,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const { method, url, body, query, params } = req;

        const userAgent = req.get('user-agent') || '';
        const ip = req.ip || req.connection.remoteAddress;

        const start = Date.now();

        // --- REQUEST ---
        this.logger.info({
            type: 'http_request',
            method,
            url,
            ip,
            userAgent,
            body,
            query,
            params,
        });


        if (body && Object.keys(body).length) {
            this.logger.debug(`[BODY] ${JSON.stringify(body)}`);
        }

        if (query && Object.keys(query).length) {
            this.logger.debug(`[QUERY] ${JSON.stringify(query)}`);
        }

        if (params && Object.keys(params).length) {
            this.logger.debug(`[PARAMS] ${JSON.stringify(params)}`);
        }

        return next.handle().pipe(
            tap({
                next: () => {
                    const responseTime = Date.now() - start;
                    this.logger.info({
                        type: 'http_response',
                        method,
                        url,
                        statusCode: res.statusCode,
                        responseTimeMs: responseTime,
                    });
                },
                error: (err) => {
                    const responseTime = Date.now() - start;
                    this.logger.error({
                        type: 'http_error',
                        method,
                        url,
                        statusCode: err.status || 500,
                        responseTimeMs: responseTime,
                        message: err.message,
                        stack: err.stack,
                    });
                },
            }),
        );
    }
}
