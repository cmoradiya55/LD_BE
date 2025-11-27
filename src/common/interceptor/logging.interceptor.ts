import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const { method, url, body, query, params } = req;

        const userAgent = req.get('user-agent') || '';
        const ip = req.ip || req.connection.remoteAddress;

        const start = Date.now();

        this.logger.log(`[REQ] ${method} ${url} - ${ip} - ${userAgent}`);

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
                    this.logger.log(
                        `[RES] ${method} ${url} - ${res.statusCode} - ${responseTime}ms`
                    );
                },
                error: (err) => {
                    const responseTime = Date.now() - start;
                    this.logger.error(
                        `[ERR] ${method} ${url} - ${err.status || 500} - ${responseTime}ms - ${err.message}`,
                        err.stack
                    );
                },
            }),
        );
    }
}
