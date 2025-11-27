import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { Request } from 'express';
import { ResponseType } from '../enums/response-type.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly logger: LoggerService,
    ) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        return this.handleHttpException(exception, host);
    }

    private handleHttpException(exception: any, host: ArgumentsHost) {
        const http = host.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        const isHttp = exception instanceof HttpException;
        let status = isHttp
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let errors: Array<{ field: string; message: string }> | undefined;
        let data: any;

        if (isHttp) {
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
                const responseObj = exceptionResponse as any;

                message = responseObj.message || 'An error occurred';

                if (responseObj.errors) {
                    errors = responseObj.errors;
                }

                if (responseObj.data) {
                    data = responseObj.data;
                }
            } else {
                message = exceptionResponse as string;
            }

            this.logger.warn(
                `[Error]: ${message} ${status}
                 [Request]: ${request.method} - ${request.url},
                `,
            )
        } else {
            const isExceptionInstanceError = exception instanceof Error;
            this.logger.error(
                `[Unexpected Error]: ${exception}
                 [Request]: ${request.method} - ${request.url}`,
                isExceptionInstanceError ? exception.stack : '',
            );

            message = isExceptionInstanceError ? exception.message : 'An unexpected error occurred.';

            if (process.env.NODE_ENV !== 'development' && isExceptionInstanceError) {
                data = {
                    error: exception.message,
                    stack: exception.stack,
                };
            }

            const errorResponse = {
                code: status,
                type: this.getResponseType(status),
                message,
                ...[errors && errors.length > 0 && { errors }],
                ...[data && { data }],
            }
        }
    }

    private getResponseType(status: number): string {
        switch (status) {
            case HttpStatus.BAD_REQUEST:
                return ResponseType.BAD_REQUEST;
            case HttpStatus.UNAUTHORIZED:
                return ResponseType.UNAUTHORIZED;
            case HttpStatus.FORBIDDEN:
                return ResponseType.FORBIDDEN;
            case HttpStatus.NOT_FOUND:
                return ResponseType.NOT_FOUND;
            case HttpStatus.METHOD_NOT_ALLOWED:
                return ResponseType.METHOD_NOT_ALLOWED;
            case HttpStatus.CONFLICT:
                return ResponseType.CONFLICT;
            case HttpStatus.UNPROCESSABLE_ENTITY:
                return ResponseType.UNPROCESSABLE_ENTITY;
            case HttpStatus.TOO_MANY_REQUESTS:
                return ResponseType.TOO_MANY_REQUESTS;
            case HttpStatus.SERVICE_UNAVAILABLE:
                return ResponseType.SERVICE_UNAVAILABLE;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return ResponseType.INTERNAL_SERVER_ERROR;
            default:
                return ResponseType.INTERNAL_SERVER_ERROR;
        }
    }
}