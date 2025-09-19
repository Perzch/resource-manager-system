import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

@ValidatorConstraint({ async: false })
export class IsCategoryValidConstraint implements ValidatorConstraintInterface {
  validate(category: Category, args: ValidationArguments) {
    if (!category || typeof category !== 'object') {
      return false;
    }

    // 检查是否提供了有效的 id 或 name
    // 对于创建资源，通常需要提供已存在的分类 id 或者分类名称
    const hasValidId =
      category.id !== undefined && category.id !== null && category.id > 0;
    const hasValidName =
      category.name !== undefined &&
      category.name !== null &&
      category.name.trim() !== '';

    return hasValidId || hasValidName;
  }

  defaultMessage(args: ValidationArguments) {
    return '分类信息必须包含有效的 id 或 name 属性';
  }
}

export function IsCategoryValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCategoryValidConstraint,
    });
  };
}
