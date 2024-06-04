import { IsArray, IsObject, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  question: string;

  @IsArray({ each: true })
  history: Array<[string, string]>;
}

export class ChatEmbeddingDto {
  @IsString()
  text: string;

  @IsObject()
  metadata: object;
}
