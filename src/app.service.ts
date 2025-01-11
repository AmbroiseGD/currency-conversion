import { Injectable } from '@nestjs/common';

interface ITaskObject {
  taskId: number;
  status: string;
  conversionRate: number;
  exchangeAmount: number;
  retrieveAmount: number;
  progression: number;
}
interface ITaskMap {
  [taskId: string]: ITaskObject;
}

@Injectable()
export class AppService {
  constructor() {}
  taskMap: ITaskMap = {};
  allowedCurrency: string[] = ['EUR', 'USD', 'PLN', 'DIN'];

  getAll(): string[] {
    return Object.keys(this.taskMap);
  }
  validateInput(
    taskId: number,
    baseCurrency: string,
    targetCurrency: string,
    amount: number,
  ): number {
    if (
      this.allowedCurrency.includes(baseCurrency) &&
      this.allowedCurrency.includes(targetCurrency)
    ) {
      console.log('Currency selected allowed.');
      let baseValue = 0;
      for (let i = 0; i < baseCurrency.length; i++) {
        baseValue += baseCurrency.charCodeAt(i);
      }
      let targetValue = 0;
      for (let i = 0; i < targetCurrency.length; i++) {
        targetValue += targetCurrency.charCodeAt(i);
      }
      this.taskMap[taskId] = {
        conversionRate: baseValue / targetValue,
        exchangeAmount: amount,
        progression: 0,
        retrieveAmount: NaN,
        status: 'None',
        taskId: taskId,
      };
      console.log(`Conversion rate : ${this.taskMap[taskId].conversionRate}`);
      return 0;
    } else {
      console.log('Currency selected not allowed yet.');
      return -1;
    }
  }
  conversion(taskId: number) {
    // ConvertCurrency
    this.taskMap[taskId].retrieveAmount =
      this.taskMap[taskId].exchangeAmount * this.taskMap[taskId].conversionRate;
    return 0;
  }
  runningSimulation(taskId: number) {
    // RunningSimulation
    if (this.taskMap[taskId].status != 'completed') {
      // not yet simulated

      let iteration = 0;
      let randomFailure = Math.random();
      do {
        randomFailure = Math.random();
        this.taskMap[taskId].status = 'in progress';
        iteration += 1;
        const addTime = (Math.random() * 15 + 5) * 1000;
        const timeOrigin = Date.now();
        while (Date.now() - timeOrigin < addTime) {
          this.taskMap[taskId].progression =
            ((Date.now() - timeOrigin) / addTime) * 100;
          if (this.taskMap[taskId].progression % 10 === 0) {
            console.log(
              `Task on going : ${this.taskMap[taskId].progression}%`,
            );
          }
        }
        this.taskMap[taskId].progression = 100;
        if (randomFailure < 0.25) {
          console.log(`Error during process : Attempt ${iteration}`);
        }
      } while (randomFailure < 0.25 && iteration <= 2);
      if (iteration >= 3) {
        this.taskMap[taskId].status = 'fail';
        console.log(
          `After ${iteration}, the exchange ran into an UNKNOWN error. Try again.`,
        );
        return -1;
      } else {
        this.taskMap[taskId].status = 'completed';
        return 0;
      }
    }
    return 0;
  }

  getTaskDetails(taskIdIn: number): {
    taskId: number;
    status: string;
    progress: number;
  } {
    if (this.taskMap[taskIdIn] !== undefined) {
      return {
        taskId: this.taskMap[taskIdIn].taskId,
        status: this.taskMap[taskIdIn].status,
        progress: this.taskMap[taskIdIn].progression,
      };
    } else {
      return undefined;
    }
  }

  async postConversion(
    baseCurrency: string,
    targetCurrency: string,
    amount: number,
  ): Promise<{ taskId: number }> {
    let baseValue = 0;
    for (let i = 0; i < baseCurrency.length; i++) {
      baseValue += baseCurrency.charCodeAt(i);
    }
    let targetValue = 0;
    for (let i = 0; i < targetCurrency.length; i++) {
      targetValue += targetCurrency.charCodeAt(i);
    }
    const taskId: number = baseValue * targetValue * amount;

    await Promise.all([
      this.validateInput(taskId, baseCurrency, targetCurrency, amount),
      this.conversion(taskId),
      this.runningSimulation(taskId),
    ]);
    return { taskId: taskId };
  }
}
