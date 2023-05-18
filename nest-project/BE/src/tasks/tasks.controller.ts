import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly _svc: TasksService) {}

  @Get()
  public getAllTasks(): Task[] {
    return this._svc.getAllTasks();
  }

  @Post()
  public createTask(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Task {
    return this._svc.createTask(title, description);
  }
}
