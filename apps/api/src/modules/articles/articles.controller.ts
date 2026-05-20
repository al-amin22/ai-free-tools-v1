import { Controller, Post, Body, HttpCode, HttpStatus, Headers, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsString, IsOptional } from 'class-validator';
import { ArticlesService } from './articles.service';

class GenerateArticleDto {
  @IsString() toolId!: string;
  @IsString() toolName!: string;
  @IsString() keyword!: string;
  @IsOptional() @IsString() stateName?: string;
  @IsOptional() @IsString() categoryId?: string;
}

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly config: ConfigService
  ) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(
    @Body() dto: GenerateArticleDto,
    @Headers('x-internal-secret') secret: string | undefined
  ) {
    const expected = this.config.get<string>('INTERNAL_SECRET');
    if (expected && secret !== expected) {
      throw new UnauthorizedException('Invalid internal secret');
    }

    const result = await this.articlesService.generateAndSave({
      toolId: dto.toolId,
      toolName: dto.toolName,
      keyword: dto.keyword,
      stateName: dto.stateName,
      categoryId: dto.categoryId,
    });

    return result;
  }
}
