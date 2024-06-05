import { Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const start = Date.now();

    // 응답이 끝났을 때
    response.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `${method} ${duration}ms ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} `,
      );
    });

    next();
  }
}
