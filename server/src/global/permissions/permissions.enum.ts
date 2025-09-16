export enum PermissionEnum {
  DOWNLOADABLE = 1 << 0, // 1 下载权限
  UPLOADABLE = 1 << 1, // 2 上传权限
  AUDITABLE = 1 << 2, // 4 审核权限
  PUBLISHABLE = 1 << 3, // 8 发布权限
  MANAGEABLE = 1 << 4, // 16 管理权限
}
