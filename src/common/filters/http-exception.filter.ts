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
                ...[errors && errors.length > 0 && { errors }],
                ...[data && { data }],
            }
            // httpAdapter.reply(response, responseBody, status);
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
                ...[errors && errors.length > 0 && { errors }],
                ...[data && { data }],
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



// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// src/common/filters/all-exceptions.filter.ts
// import {
//     ExceptionFilter,
//     Catch,
//     ArgumentsHost,
//     HttpException,
//     HttpStatus,
//     Inject,
// } from '@nestjs/common';
// import type { LoggerService } from '@nestjs/common';
// import { HttpAdapterHost } from '@nestjs/core';
// import { Request } from 'express';

// interface IErrorResponse {
//     statusCode: number;
//     message: string;
//     errorCode?: string;
//     errors?: string | string[] | Record<string, any>;
//     path: string;
//     timestamp: string;
// }

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//     constructor(
//         private readonly httpAdapterHost: HttpAdapterHost,
//         @Inject('WINSTON_MODULE_NEST_PROVIDER') private readonly logger: LoggerService,
//     ) { }

//     catch(exception: unknown, host: ArgumentsHost): void {
//         const { httpAdapter } = this.httpAdapterHost;
//         const ctx = host.switchToHttp();
//         const request = ctx.getRequest<Request>();
//         const response = ctx.getResponse();

//         const isHttpException = exception instanceof HttpException;

//         const httpStatus = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

//         const path = httpAdapter.getRequestUrl(request);
//         const timestamp = new Date().toISOString();

//         let responseBody: IErrorResponse;
//         let logMessage: string;

//         if (isHttpException) {
//             const exceptionResponse = exception.getResponse();
//             logMessage = exception.message;

//             if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
//                 const errorObj = exceptionResponse as { message: string | string[]; error?: string; errors?: any };
//                 const message = Array.isArray(errorObj.message) ? errorObj.message.join(', ') : errorObj.message;

//                 responseBody = {
//                     statusCode: httpStatus,
//                     message: message,
//                     errorCode: errorObj.error || 'UNSPECIFIED',
//                     errors: errorObj.errors || (Array.isArray(errorObj.message) ? errorObj.message : undefined),
//                     path,
//                     timestamp,
//                 };
//             } else {
//                 responseBody = {
//                     statusCode: httpStatus,
//                     message: exceptionResponse as string,
//                     path,
//                     timestamp,
//                 };
//             }
//         } else {
//             logMessage = 'An unexpected internal server error occurred.';
//             responseBody = {
//                 statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//                 message: 'Internal Server Error',
//                 errorCode: 'INTERNAL_ERROR',
//                 path,
//                 timestamp,
//             };
//         }

//         this.logger.error(
//             logMessage,
//             {
//                 timestamp,
//                 path,
//                 request: {
//                     method: request.method,
//                     url: request.url,
//                     headers: request.headers,
//                     body: request.body,
//                     errors: responseBody?.errors,
//                 },
//                 exception: {
//                     name: exception instanceof Error ? exception.name : 'UnknownException',
//                     message: exception instanceof Error ? exception.message : String(exception),
//                     stack: exception instanceof Error ? exception.stack : undefined,
//                 },
//             }
//         );

//         if (process.env.NODE_ENV === 'development') {
//             responseBody['stack'] = exception instanceof Error ? exception.stack : undefined;
//         }

//         httpAdapter.reply(response, responseBody, httpStatus);
//     }
// }