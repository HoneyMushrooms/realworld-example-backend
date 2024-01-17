import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagServise: TagService) {}

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tagData = await this.tagServise.findAll();
    return {
      tags: tagData.map((tag) => tag.text),
    };
  }
}
