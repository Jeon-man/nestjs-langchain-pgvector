import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prompt } from '@util/makeChain';
import { ChatMetadata } from '@module/vectorStore/chat/chat.metadata';

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
  metadata?: ChatMetadata;

  @ApiProperty({
    example: {
      CONDENSE_TEMPLATE: 'string',
      QA_TEMPLATE: 'string',
    },
  })
  @IsOptional()
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

export class PdfEmbeddingDto {
  @ApiPropertyOptional()
  @IsNumber()
  messageGroupId?: number;
}
