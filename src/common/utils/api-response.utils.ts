import { HttpStatus } from "@nestjs/common";
import { ResponseType } from "../enums/response-type.enum";

export interface ApiResponse<T = any> {
    code: number;
    type: ResponseType;
    message: string;
    data?: T;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ErrorResponse<T = any> {
    code: number;
    type: ResponseType;
    message: string;
    data?: T;
}

export class ApiResponseUtil {

    // 200 - OK
    static success<T>(message = 'Success', data?: T): ApiResponse<T> {
        const res = {
            code: HttpStatus.OK,
            type: ResponseType.SUCCESS,
            message,
            data
        }

        if (data) {
            res['data'] = data;
        }

        return res;
    }

    // 201 - Created
    static created<T>(message = 'Resource created successfully', data?: T): ApiResponse<T> {
        const res = {
            code: HttpStatus.CREATED,
            type: ResponseType.CREATED,
            message,
        };

        if (data) {
            res['data'] = data;
        }
        return res;
    }

    // 202 - Accepted
    static accepted<T>(data?: T, message = 'Request Accepted'): ApiResponse<T> {
        return {
            code: HttpStatus.ACCEPTED,
            type: ResponseType.ACCEPTED,
            message,
            data
        }
    }

    // 204 - No Content
    static noContent(message = 'No Content'): ApiResponse<null> {
        return {
            code: HttpStatus.NO_CONTENT,
            type: ResponseType.NO_CONTENT,
            message,
        }
    }

    // 200 - Paginated Response
    static paginated<T>(
        message = 'Success',
        data: T,
        page: number,
        limit: number,
        total: number,
    ): PaginatedResponse<T> {
        return {
            code: HttpStatus.OK,
            type: ResponseType.SUCCESS,
            message,
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        }
    }

    // 200 - Updated
    static updated<T>(message = 'Resource updated successfully', data?: T): ApiResponse<T> {
        return this.success(message, data);
    }

    // 200 - Deleted
    static deleted<T>(message = 'Resource deleted successfully', data?: T): ApiResponse<T> {
        return this.success(message, data);
    }

    // 400 - Bad Request
    static badRequest<T>(message = 'Bad Request', data?: T): ErrorResponse<T> {
        return {
            code: HttpStatus.BAD_REQUEST,
            type: ResponseType.BAD_REQUEST,
            message,
            data
        }
    }

    // 401 - Unauthorized
    static unauthorized<T>(message = 'Unauthorized', data?: T): ErrorResponse<T> {
        return {
            code: HttpStatus.UNAUTHORIZED,
            type: ResponseType.UNAUTHORIZED,
            message,
            data
        }
    }

    // 403 - Forbidden
    static forbidden<T>(message = 'Forbidden', data?: T): ErrorResponse<T> {
        return {
            code: HttpStatus.FORBIDDEN,
            type: ResponseType.FORBIDDEN,
            message,
            data
        }
    }

    // 404 - Not Found
    static notFound<T>(message = 'Not Found', data?: T): ErrorResponse<T> {
        console.log('========= 404 NOT FOUND =========');
        return {
            code: HttpStatus.NOT_FOUND,
            type: ResponseType.NOT_FOUND,
            message,
            data
        }
    }

    // 405 - Method Not Allowed
    static methodNotAllowed<T>(message = 'Method Not Allowed', data?: T): ErrorResponse<T> {
        return {
            code: HttpStatus.METHOD_NOT_ALLOWED,
            type: ResponseType.METHOD_NOT_ALLOWED,
            message,
            data
        }
    }

    // 409 - Conflict
    static conflict<T>(message = 'Conflict', data?: T): ErrorResponse<T> {
        return {
            code: HttpStatus.CONFLICT,
            type: ResponseType.CONFLICT,
            message,
            data
        }
    }

    // 422 - Unprocessable Entity
    static unprocessableEntity<T>(message = 'Unprocessable Entity', data?: T): ErrorResponse<T> {
        return {
            code: HttpStatus.UNPROCESSABLE_ENTITY,
            type: ResponseType.UNPROCESSABLE_ENTITY,
            message,
            data
        }
    }

    // 429 - Too Many Requests
    static tooManyRequests<T>(message = 'Too Many Requests', data?: T): ErrorResponse<T> {
        return {
            code: HttpStatus.TOO_MANY_REQUESTS,
            type: ResponseType.TOO_MANY_REQUESTS,
            message,
            data
        }
    }

    // 503 - Service Unavailable
    static serviceUnavailable<T>(message = 'Service Unavailable', data?: T): ErrorResponse<T> {
        return {
            code: HttpStatus.SERVICE_UNAVAILABLE,
            type: ResponseType.SERVICE_UNAVAILABLE,
            message,
            data
        }
    }

    // 500 - Internal Server Error
    static internalServerError<T>(message = 'Internal Server Error', data?: T): ErrorResponse<T> {
        return {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            type: ResponseType.INTERNAL_SERVER_ERROR,
            message,
            data
        }
    }
}