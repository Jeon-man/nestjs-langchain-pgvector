import { EnvironmentVariables } from '@module/config/config.service';

declare module '@nestjs/config' {
  export class ConfigService {
    get<T extends keyof EnvironmentVariables>(key: T): EnvironmentVariables[T];
  }
}
