import { IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  question: string;

  @IsString()
  history: Array<[string, string]>;
}
