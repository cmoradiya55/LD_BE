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
import { HttpAdapterHost } from '@nestjs/core';

interface IErrorResponse {
    code: number;
    type: string;
    message: string;
    errorCode?: string;
    errors?: string | string[] | Record<string, any>;
    path: string;
    timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject('WINSTON_MODULE_NEST_PROVIDER') private readonly logger: LoggerService,
    ) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        return this.handleHttpException(exception, host);
    }

    private handleHttpException(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const http = host.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        const isHttp = exception instanceof HttpException;
        let status = isHttp
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const timestamp = new Date().toISOString();
        const path = httpAdapter.getRequestUrl(request);

        let responseBody: IErrorResponse;
        let logMessage: string;

        let message = 'Internal Server Error';
        let errors: Array<{ field: string; message: string }> | undefined;
        let data: any;

        if (isHttp) {
            const exceptionResponse = exception.getResponse();
            console.log('========= Exception Response =========', exceptionResponse);

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
            this.logger.error(
                exception.message,
                { path: request.url, timestamp: new Date().toISOString(), stack: exception.stack },
            );

            responseBody = {
                code: status,
                type: this.getResponseType(status),
                message,
                path,
                timestamp,
                ...(errors && errors.length > 0 && { errors }),
                ...(data && { data }),
            }
        } else {
            logMessage = 'An unexpected internal server error occurred.';
            const isExceptionInstanceError = exception instanceof Error;

            this.logger.error(
                exception.message,
                {
                    method: request.method,
                    path: request.url,
                    timestamp: new Date().toISOString(),
                    stack: exception.stack
                },
            );

            if (process.env.NODE_ENV !== 'development' && isExceptionInstanceError) {
                data = {
                    error: exception.message,
                    stack: exception.stack,
                };
            }

            responseBody = {
                code: status,
                type: this.getResponseType(status),
                message,
                path,
                timestamp,
                ...(errors && errors.length > 0 && { errors }),
                ...(data && { data }),
            }
        }
        httpAdapter.reply(response, responseBody, status);
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