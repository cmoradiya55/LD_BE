// src/common/validators/array-validators.ts

import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

/**
 * Validates array of positive integers
 */
export function IsPositiveIntArray(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isPositiveIntArray',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (value === undefined || value === null) return true;
                    if (!Array.isArray(value)) return false;
                    return value.every((v) => Number.isInteger(v) && v > 0);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must contain only positive integers`;
                },
            },
        });
    };
}

/**
 * Validates array values are within range
 */
export function IsIntArrayInRange(min: number, max: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isIntArrayInRange',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (value === undefined || value === null) return true;
                    if (!Array.isArray(value)) return false;
                    return value.every((v) => Number.isInteger(v) && v >= min && v <= max);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} values must be between ${min} and ${max}`;
                },
            },
        });
    };
}

/**
 * Validates array values against enum
 */
export function IsEnumArray(enumType: object, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isEnumArray',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (value === undefined || value === null) return true;
                    if (!Array.isArray(value)) return false;
                    const enumValues = Object.values(enumType);
                    return value.every((v) => enumValues.includes(v));
                },
                defaultMessage(args: ValidationArguments) {
                    const enumValues = Object.values(enumType).join(', ');
                    return `${args.property} must contain valid values: ${enumValues}`;
                },
            },
        });
    };
}