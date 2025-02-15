import { Test, TestingModule } from '@nestjs/testing';
import { LlamaService } from './llama.service';

describe('LlamaService', () => {
  let service: LlamaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlamaService],
    }).compile();

    service = module.get<LlamaService>(LlamaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
