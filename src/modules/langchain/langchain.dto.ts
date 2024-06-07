import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { ChatStoreMetadata } from './langchain.interface';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty({
    type: Array<[string, string]>,
    example: [
      ['1+2', '3'],
      ['how are you', 'good'],
    ],
  })
  @IsArray({ each: true })
  history: Array<[string, string]>;

  @ApiProperty({
    example: {
      messageGroupId: 1,
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: ChatStoreMetadata;
}

export class ChatEmbeddingDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({
    example: {
      messageGroupId: 1,
    },
  })
  @IsObject()
  metadata: object;
}
