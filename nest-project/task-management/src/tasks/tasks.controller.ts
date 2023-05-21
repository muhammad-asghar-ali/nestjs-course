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
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.tdo';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly _svc: TasksService) {}

  @Get()
  public getAllTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
  ): Promise<Task[]> {
    return this._svc.getTasks(filterDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async createTask(@Body() createTask: CreateTaskDto): Promise<Task> {
    return this._svc.createTask(createTask);
  }

  @Get(':id')
  public async getTaskById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Task> {
    return this._svc.getTaskById(id);
  }

  @Delete(':id')
  public async deleteTaskById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DeleteResult> {
    return this._svc.deleteTaskById(id);
  }

  @Patch(':id/status')
  public async updateTaskStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this._svc.updateTaskStatus(id, status);
  }
}
