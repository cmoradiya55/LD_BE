import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function AtLeastOneRemark(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'AtLeastOneRemark',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj: any = args.object;

          if (obj.is_damage !== true) return true;

          const hasRemarks = typeof obj.remarks === 'string' && obj.remarks.trim().length > 0;

          const hasOtherRemarks =
            Array.isArray(obj.other_remarks) &&
            obj.other_remarks.some(r => typeof r === 'string' && r.trim().length > 0);

          return hasRemarks || hasOtherRemarks;
        },
      },
    });
  };
}
