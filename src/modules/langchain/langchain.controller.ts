import { Controller, Post } from '@nestjs/common';

@Controller('lang-chain')
export class LangChainController {
  constructor() {}

  @Post('pdf')
  async readPdf() {}
}
