import { plainToInstance, Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

export enum DatabaseDialect {
  Mysql = 'mysql',
  Postgres = 'postgres',
}

export class EnvironmentVariables {
  @IsOptional()
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test' = 'development';

  @Type(() => Number)
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  PORT: number = 3000;

  // Database Information
  @IsString()
  SQL_DATABASE: string;

  @IsString()
  SQL_USER: string;

  @IsString()
  SQL_PASSWORD: string;

  @IsString()
  SQL_HOST: string;

  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  SQL_PORT: number;
}

export const validateConfig = (env: Record<string, any>) => {
  const envInstance = plainToInstance(EnvironmentVariables, env, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
    exposeUnsetFields: true,
  });

  validateSync(envInstance, {
    enableDebugMessages: true,
  });

  return envInstance;
};
