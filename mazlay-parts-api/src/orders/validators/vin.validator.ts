import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidVINConstraint implements ValidatorConstraintInterface {
  validate(vin: any) {
    if (typeof vin !== 'string') return false;
    // Regex check: 17 chars, alphanumeric, NO I, O, Q (case insensitive for regex, we enforce uppercase in logic or regex)
    const regex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    return regex.test(vin);
  }

  defaultMessage() {
    return 'Số VIN phải bao gồm chính xác 17 ký tự chữ và số, KHÔNG ĐƯỢC chứa các ký tự (I, O, Q).';
  }
}

export function IsValidVIN(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidVINConstraint,
    });
  };
}
