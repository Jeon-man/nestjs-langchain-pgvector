import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LangChainService } from './langchain.service';
import { ChatDto } from './langchain.dto';

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

  @Post('question')
  async chatQuestion(@Body() { question, history }: ChatDto) {
    const sanitizedQuestion = question.trim().replace('\n', ' ');

    const chain = await this.langchainService.getChatStoreChain();

    const pastMessages = history
      .map(([human, assistant]) => [`Human: ${human}`, `Assistant: ${assistant}`].join('\n'))
      .join('\n');

    return chain.invoke({
      question: sanitizedQuestion,
      chat_history: pastMessages,
    });
  }
}
