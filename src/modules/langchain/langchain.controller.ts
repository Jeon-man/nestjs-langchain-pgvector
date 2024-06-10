import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LangChainService } from './langchain.service';
import { ChatDto, ChatEmbeddingDto } from './langchain.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('lang-chain')
export class LangChainController {
  constructor(private readonly langchainService: LangChainService) {}

  @ApiTags('general')
  @ApiOperation({
    summary: 'search from vector',
  })
  @Get('similaritySearch')
  async getSearch(@Query('q') q: string) {
    return this.langchainService.searchByQuery(q, 23);
  }

  @ApiTags('pdf')
  @ApiOperation({
    summary: 'embedding pdf row',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('pdf')
  async readPdf(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log(file);
      await this.langchainService.embeddingPdf(file.path);
    } catch (err) {
      throw err;
    }

    return true;
  }

  @ApiTags('pdf')
  @ApiOperation({
    summary: 'search from pdf vector store',
  })
  @Post('pdf/question')
  async searchDocument(@Body() { question }: ChatDto) {
    const sanitizedQuestion = question.trim().replace('\n', ' ');

    const chain = await this.langchainService.getFileStoreChain();

    return chain.invoke({
      question: sanitizedQuestion,
      chat_history: '',
    });
  }

  @ApiTags('chat')
  @ApiOperation({
    summary: 'search from chat vector store',
  })
  @Post('chat/question')
  async chatQuestion(@Body() { question, history, metadata, prompt }: ChatDto) {
    const sanitizedQuestion = question.trim().replace('\n', ' ');

    const chain = await this.langchainService.getChatStoreChain(undefined, metadata, prompt);

    const pastMessages = history
      .map(([human, assistant]) => [`Human: ${human}`, `Assistant: ${assistant}`].join('\n'))
      .join('\n');

    return chain.invoke({
      question: sanitizedQuestion,
      chat_history: pastMessages,
    });
  }

  @ApiTags('chat')
  @ApiOperation({
    summary: 'embedding chat row',
  })
  @Post('chat/embedding')
  async embeddingChat(@Body() { text, metadata }: ChatEmbeddingDto) {
    await this.langchainService.embeddingChat(text, metadata);
  }
}
