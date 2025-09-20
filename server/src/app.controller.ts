import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPermission } from './global/decorators/permission.decorator';
import { PermissionEnum } from './global/permissions/permissions.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPermission(PermissionEnum.WRITE)
  @Get('/getSignature/:fileType')
  async getUploadSecretKey(@Param('fileType') fileType: string) {
    return this.appService.getUploadSecretKey(fileType);
  }
}
