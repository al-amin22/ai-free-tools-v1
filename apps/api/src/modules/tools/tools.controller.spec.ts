import { Test, TestingModule } from '@nestjs/testing';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { ALL_TOOLS } from '@aifreetools/tool-configs';

describe('ToolsController', () => {
  let controller: ToolsController;

  const mockToolsService = {
    getAllTools: jest.fn().mockReturnValue(ALL_TOOLS.slice(0, 3)),
    getToolById: jest.fn().mockImplementation((id: string) => {
      const tool = ALL_TOOLS.find((t) => t.id === id);
      if (!tool) throw new Error('Not found');
      return tool;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToolsController],
      providers: [{ provide: ToolsService, useValue: mockToolsService }],
    }).compile();

    controller = module.get<ToolsController>(ToolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('listTools returns array', () => {
    const result = controller.listTools();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
  });

  it('getTool returns tool by id', () => {
    const tool = controller.getTool('nda-generator');
    expect(tool.id).toBe('nda-generator');
  });
});
