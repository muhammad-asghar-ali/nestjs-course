import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.tdo';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly _svc: TasksService) {}

  @Get()
  public getAllTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this._svc.getTasksWithFilter(filterDto);
    } else {
      return this._svc.getAllTasks();
    }
  }

  @Post()
  @UsePipes(ValidationPipe)
  public createTask(@Body() createTask: CreateTaskDto): Task {
    return this._svc.createTask(createTask);
  }

  @Get(':id')
  public getTaskById(@Param('id', new ParseUUIDPipe()) id: string): Task {
    return this._svc.getTaskById(id);
  }

  @Delete(':id')
  public deleteTaskById(@Param('id', new ParseUUIDPipe()) id: string): Task {
    return this._svc.deleteTaskById(id);
  }

  @Patch(':id/status')
  public updateTaskStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this._svc.updateTaskStatus(id, status);
  }
}
