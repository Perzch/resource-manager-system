export enum PermissionEnum {
  READ = 1 << 0, // 1 读取权限
  WRITE = 1 << 1, // 2 写入权限
  UPDATE = 1 << 2, // 4 更新权限
  DELETE = 1 << 3, // 8 删除权限
  MANAGE = READ | WRITE | UPDATE, // 7 管理权限,拥有读写更新权限
  ADMIN = READ | WRITE | UPDATE | DELETE, // 15 管理员权限，拥有所有权限
}
