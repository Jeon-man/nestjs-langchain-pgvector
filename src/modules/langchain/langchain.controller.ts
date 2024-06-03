import { Controller, Post } from '@nestjs/common';
import { LangChainService } from './langchain.service';

@Controller('lang-chain')
export class LangChainController {
  constructor(private readonly langchainService: LangChainService) {}

  @Post('pdf')
  async readPdf() {
    try {
      await this.langchainService.embeddingPdf();
    } catch (err) {
      throw err;
    }

    return true;
  }
}
