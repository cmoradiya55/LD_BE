import { BadRequestException, ValidationError } from "@nestjs/common";

export function validationExceptionFactory(
    validationErrors: ValidationError[] = []
): BadRequestException {
    const errors = formatErrors(validationErrors);
    return new BadRequestException({
        message: 'Validation failed',
        errors,
    });
}

export function formatErrors(
    errors: ValidationError[],
): Array<{ field: string; message: string }> {
    const formatted: Array<{ field: string; message: string }> = [];

    errors.forEach((error) => {
        if (error.constraints) {
            const messages = Object.values(error.constraints);
            formatted.push({
                field: error.property,
                message: messages[0],
            });
        }

        if (error.children && error.children.length > 0) {
            formatted.push(...formatErrors(error.children));
        }
    });
    return formatted;
}