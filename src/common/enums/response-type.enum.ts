export enum ResponseType {
    SUCCESS = 'success',
    CREATED = 'created',
    ACCEPTED = 'accepted',
    NO_CONTENT = 'no_content',
    ALREADY_REPORTED = 'already_reported',

    BAD_REQUEST = 'bad_request',
    UNAUTHORIZED = 'unauthorized',
    FORBIDDEN = 'forbidden',
    NOT_FOUND = 'not_found',
    METHOD_NOT_ALLOWED = 'method_not_allowed',
    CONFLICT = 'conflict',
    UNPROCESSABLE_ENTITY = 'unprocessable_entity',
    TOO_MANY_REQUESTS = 'too_many_requests',
    SERVICE_UNAVAILABLE = 'service_unavailable',
    INTERNAL_SERVER_ERROR = 'internal_server_error',
}