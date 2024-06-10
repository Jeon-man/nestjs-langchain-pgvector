import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { FileVectorStoreStrategy } from '@module/vectorStore/file/file.vectorStore.strategy';
import { ChatVectorStoreStrategy } from '@module/vectorStore/chat/chat.vectorStore.strategy';
import { Prompt } from '@util/makeChain';
import { FileMetadata } from '@module/vectorStore/file/file.metadata';
import { ChatMetadata } from '@module/vectorStore/chat/chat.metadata';
import { MetadataFilterOptions } from '@module/vectorStore/metadata';

@Injectable()
export class LangChainService {
  constructor(
    private readonly fileVectorStore: FileVectorStoreStrategy,
    private readonly chatVectorStore: ChatVectorStoreStrategy,
  ) {}

  async embeddingPdf(filepath: string) {
    const pdfLoader = new PDFLoader(filepath);
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
    await this.fileVectorStore.addDocument(embeddings);
  }

  async embeddingChat(text: string, metadata: object) {
    return this.chatVectorStore.addDocument([{ pageContent: text, metadata }]);
  }

  async searchByQuery(query: string, key?: number) {
    return this.fileVectorStore.search(query, key);
  }

  async getFileStoreChain(
    key?: number,
    filter?: MetadataFilterOptions<FileMetadata>,
    prompt?: Partial<Prompt>,
  ) {
    return this.fileVectorStore.getChain(key, filter, prompt);
  }

  async getChatStoreChain(
    key?: number,
    filter?: MetadataFilterOptions<ChatMetadata>,
    prompt?: Partial<Prompt>,
  ) {
    return this.chatVectorStore.getChain(key, filter, prompt);
  }
}
