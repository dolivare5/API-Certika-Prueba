import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './authores.service';

describe('AuthoresService', () => {
  let service: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorService],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
