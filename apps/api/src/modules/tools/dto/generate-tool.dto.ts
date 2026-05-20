import { IsString, IsObject, IsOptional } from 'class-validator';

export class GenerateToolDto {
  @IsObject()
  inputs!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
