import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './config.service';

export const configDynamicModule = ConfigModule.forRoot({
  isGlobal: true,
  cache: true,
  validate: validateConfig,
});
