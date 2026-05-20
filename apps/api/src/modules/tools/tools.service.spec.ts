import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { AIProviderRouter } from '../../engines/ai/ai-provider-router';
import { PrismaService } from '../../database/prisma.service';

describe('ToolsService', () => {
  let service: ToolsService;

  const mockAIRouter = { generate: jest.fn(), generateStream: jest.fn() };
  const mockPrisma = {
    toolGeneration: {
      create: jest.fn().mockResolvedValue({ id: 'gen-123' }),
      update: jest.fn().mockResolvedValue({}),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolsService,
        { provide: AIProviderRouter, useValue: mockAIRouter },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ToolsService>(ToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllTools returns all 65 tools', () => {
    const tools = service.getAllTools();
    expect(tools.length).toBe(65);
  });

  it('getToolById returns tool', () => {
    const tool = service.getToolById('nda-generator');
    expect(tool.id).toBe('nda-generator');
  });

  it('getToolById throws NotFoundException for unknown id', () => {
    expect(() => service.getToolById('non-existent')).toThrow(NotFoundException);
  });
});
