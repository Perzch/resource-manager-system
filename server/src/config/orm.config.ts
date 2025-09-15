import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
};

export default config;
