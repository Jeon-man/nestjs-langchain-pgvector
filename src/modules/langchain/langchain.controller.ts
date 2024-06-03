import { Controller, Get, Post, Query } from '@nestjs/common';
import { LangChainService } from './langchain.service';

@Controller('lang-chain')
export class LangChainController {
  constructor(private readonly langchainService: LangChainService) {}

  @Get('similaritySearch')
  async getSearch(@Query('q') q: string) {
    return this.langchainService.searchByQuery(q, 23);
  }

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
