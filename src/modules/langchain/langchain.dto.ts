import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { ChatStoreMetadata } from './langchain.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Prompt } from '@util/makeChain';

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

  @ApiProperty({
    example: {
      CONDENSE_TEMPLATE: 'string',
      QA_TEMPLATE: 'string',
    },
  })
  @IsObject()
  prompt?: Partial<Prompt>;
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
