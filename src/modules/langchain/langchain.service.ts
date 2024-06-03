import { VectorStoreProvider } from '@module/vectorStore/vectorStore.service';
import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import appRootPath from 'app-root-path';

@Injectable()
export class LangChainService {
  constructor(private readonly vectorStore: VectorStoreProvider) {}

  async embeddingPdf() {
    const pdfLoader = new PDFLoader(appRootPath + '/storage/test.pdf');
    const pdf = await pdfLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 50,
    });

    const texts = await textSplitter.splitDocuments(pdf);
    let embeddings: Document[] = [];

    for (let i = 0; i < texts.length; i++) {
      const page = texts[i];
      const splitTexts = await textSplitter.splitText(page.pageContent);

      const pageEmbeddings = splitTexts.map(text => ({
        pageContent: text,
        metadata: {
          pageNumber: i,
        },
      }));
      embeddings = embeddings.concat(pageEmbeddings);
    }
    await this.vectorStore.addDocument(embeddings);
  }

  async searchToQuery(query: string, key?: number) {
    return this.vectorStore.search(query, key);
  }
}
