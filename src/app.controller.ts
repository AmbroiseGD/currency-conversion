import { Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('simulate-exchange')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAll(): string[] {
    return this.appService.getAll();
  }

  @Get('id')
  getTask(@Param('id') id: number) {
    return this.appService.getTaskDetails(id);
  }

  @Post()
  async postExchange(
    baseCurrency: string,
    targetCurrency: string,
    amount: number,
  ) {
    return this.appService.postConversion(baseCurrency, targetCurrency, amount);
  }
}
