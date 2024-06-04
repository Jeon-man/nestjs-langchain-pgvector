import { BadRequestException, Injectable } from '@nestjs/common';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import appRootPath from 'app-root-path';
import { diskStorage } from 'multer';
import fs from 'fs';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    const uploadPath = appRootPath + '/uploads';

    return {
      fileFilter: (req, file, callback) => {
        if (file.filename.endsWith('.pdf')) callback(null, true);

        callback(new BadRequestException('Not a PDF file'), false);
      },
      storage: diskStorage({
        destination: (req, file, callback) => {
          if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          callback(null, file.filename.replace(' ', '_'));
        },
      }),
    };
  }
}
