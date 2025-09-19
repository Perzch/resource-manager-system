import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // 使用 class-transformer 进行转换，并启用默认值
    const object = plainToInstance(metatype, value, {
      enableImplicitConversion: true, // 启用隐式类型转换
      excludeExtraneousValues: false, // 不排除额外的值
    });
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((err) => Object.values(err.constraints).join(',')),
      );
    }
    // 返回转换后的对象而不是原始值
    return object;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
