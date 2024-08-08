// lang-chain.service.spec.ts

import { LangChainService } from './langchain.service';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { ChatVectorStoreStrategy } from '@module/vectorStore/chat/chat.vectorStore.strategy';
import { FileVectorStoreStrategy } from '@module/vectorStore/file/file.vectorStore.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

jest.mock('@langchain/community/document_loaders/fs/pdf'); // PDFLoader 모듈을 mock
jest.mock('langchain/text_splitter'); // RecursiveCharacterTextSplitter 모듈을 mock

describe('LangChainService', () => {
  let service: LangChainService;
  let fileVectorStore: FileVectorStoreStrategy;
  let chatVectorStore: ChatVectorStoreStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LangChainService,
        {
          provide: FileVectorStoreStrategy,
          useValue: {
            addDocument: jest.fn(),
            search: jest.fn(),
            getChain: jest.fn(),
          },
        },
        {
          provide: ChatVectorStoreStrategy,
          useValue: {
            addDocument: jest.fn(),
            getChain: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LangChainService>(LangChainService);
    fileVectorStore = module.get<FileVectorStoreStrategy>(FileVectorStoreStrategy);
    chatVectorStore = module.get<ChatVectorStoreStrategy>(ChatVectorStoreStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(fileVectorStore).toBeDefined();
    expect(fileVectorStore).toBeDefined();
  });

  describe('embeddingPdf', () => {
    it('should embed PDF and store documents', async () => {
      const mockPdf = [{ pageContent: 'Page 1 content' }, { pageContent: 'Page 2 content' }];
      const mockSplitTexts = ['Split text 1', 'Split text 2'];

      (PDFLoader as unknown as jest.Mock).mockImplementation(() => ({
        load: jest.fn().mockResolvedValue(mockPdf),
      }));

      (RecursiveCharacterTextSplitter as unknown as jest.Mock).mockImplementation(() => ({
        splitDocuments: jest.fn().mockResolvedValue(mockPdf),
        splitText: jest.fn().mockResolvedValue(mockSplitTexts),
      }));

      await service.embeddingPdf('test.pdf', true, 1);

      expect(fileVectorStore.addDocument).toHaveBeenCalled();
      expect(chatVectorStore.addDocument).toHaveBeenCalled();
    });

    it('should only store in fileVectorStore if withChat is false', async () => {
      const mockPdf = [{ pageContent: 'Page 1 content' }];
      const mockSplitTexts = ['Split text 1'];

      (PDFLoader as unknown as jest.Mock).mockImplementation(() => ({
        load: jest.fn().mockResolvedValue(mockPdf),
      }));

      (RecursiveCharacterTextSplitter as unknown as jest.Mock).mockImplementation(() => ({
        splitDocuments: jest.fn().mockResolvedValue(mockPdf),
        splitText: jest.fn().mockResolvedValue(mockSplitTexts),
      }));

      await service.embeddingPdf('test.pdf', false);

      expect(fileVectorStore.addDocument).toHaveBeenCalled();
      expect(chatVectorStore.addDocument).not.toHaveBeenCalled();
    });
  });

  describe('embeddingChat', () => {
    it('should embed chat and store document', async () => {
      const text = 'Hello, world!';
      const metadata = { user: 'user1' };

      await service.embeddingChat(text, metadata);

      expect(chatVectorStore.addDocument).toHaveBeenCalledWith([{ pageContent: text, metadata }]);
    });
  });

  describe('searchByQuery', () => {
    it('should call search on fileVectorStore', async () => {
      const query = 'search term';
      await service.searchByQuery(query);

      expect(fileVectorStore.search).toHaveBeenCalledWith(query, undefined);
    });
  });

  describe('getFileStoreChain', () => {
    it('should call getChain on fileVectorStore', async () => {
      const key = 123;
      await service.getFileStoreChain(key);

      expect(fileVectorStore.getChain).toHaveBeenCalledWith(key, undefined, undefined);
    });
  });

  describe('getChatStoreChain', () => {
    it('should call getChain on chatVectorStore', async () => {
      const key = 123;
      await service.getChatStoreChain(key);

      expect(chatVectorStore.getChain).toHaveBeenCalledWith(key, undefined, undefined);
    });
  });
});
