import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { ChatStoreMetadata } from './langchain.interface';

export class ChatDto {
  @IsString()
  question: string;

  @IsArray({ each: true })
  history: Array<[string, string]>;

  @IsOptional()
  @IsObject()
  metadata?: ChatStoreMetadata;
}

export class ChatEmbeddingDto {
  @IsString()
  text: string;

  @IsObject()
  metadata: object;
}
