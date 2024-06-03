import { VectorStoreProvider } from '@module/vectorStore/vectorStore.service';
import { Injectable } from '@nestjs/common';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

@Injectable()
export class LangChainService {
  constructor(private readonly vectorStore: VectorStoreProvider) {}

  async embeddingPdf() {
    const pdfLoader = new PDFLoader('src/');
    const pdf = pdfLoader.load();
  }
}
