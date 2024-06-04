import { IsObject, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  question: string;

  @IsString()
  history: Array<[string, string]>;
}

export class ChatEmbeddingDto {
  @IsString()
  text: string;

  @IsObject()
  metadata: object;
}
