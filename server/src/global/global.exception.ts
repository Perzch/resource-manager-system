import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const code = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.response?.message) {
      exception.message = exception.response.message.toString();
    }
    const responseBody = {
      code,
      message: exception?.message || '服务器错误',
      data: null,
    };
    console.error(exception);
    httpAdapter.reply(ctx.getResponse(), responseBody, code);
  }
}
