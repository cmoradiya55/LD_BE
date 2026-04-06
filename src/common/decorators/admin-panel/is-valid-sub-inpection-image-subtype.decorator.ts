// validators/is-valid-inspection-subtype.validator.ts
import { InspectionImageSubType } from '@common/providers/inspection-image/enum/inspection-image.enum';
import { 
    registerDecorator, 
    ValidationOptions, 
    ValidationArguments 
} from 'class-validator';

export function IsValidInspectionImageSubtype(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidInspectionImageSubtype',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const obj = args.object as any;
                    const type = obj.type;

                    // Check if type exists
                    if (!type || !InspectionImageSubType[type]) {
                        return false;
                    }

                    // Get valid subtypes for this type
                    const validSubtypes = Object.values(InspectionImageSubType[type]);
                    
                    // Check if subtype is valid
                    return validSubtypes.includes(value);
                },
                defaultMessage(args: ValidationArguments) {
                    const obj = args.object as any;
                    const type = obj.type;
                    
                    if (!type) {
                        return 'Type must be specified before subtype';
                    }

                    const validSubtypes = Object.values(InspectionImageSubType[type] || {});
                    return `Invalid subtype for type ${type}. Valid subtypes: ${validSubtypes.join(', ')}`;
                },
            },
        });
    };
}