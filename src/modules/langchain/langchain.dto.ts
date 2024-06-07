import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  question: string;

  @IsArray({ each: true })
  history: Array<[string, string]>;

  @IsOptional()
  @IsObject()
  metadata?: object;
}

export class ChatEmbeddingDto {
  @IsString()
  text: string;

  @IsObject()
  metadata: object;
}
