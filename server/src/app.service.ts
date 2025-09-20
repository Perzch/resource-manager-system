import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { minioConfig } from './config/minio.config';

@Injectable()
export class AppService {
  private minioClient: Minio.Client;
  constructor() {
    this.minioClient = new Minio.Client(minioConfig);
  }

  async getUploadSecretKey(fileType: string) {
    const bucketName = 'resource';
    // 上传的位置及文件名
    const fileKey = `${fileType}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileType}`;
    const expiresIn = 60 * 60;
    // 生成一个临时的上传url，有效期为1小时
    const presignedUrl = await this.minioClient.presignedPutObject(
      bucketName,
      fileKey,
      expiresIn,
    );
    return {
      bucketName,
      fileKey,
      presignedUrl,
    };
  }
}
