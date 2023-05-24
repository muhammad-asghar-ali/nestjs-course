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
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.tdo';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly _svc: TasksService) {}

  @Get()
  public getAllTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @Req() req,
  ): Promise<Task[]> {
    const user = req.user;
    return this._svc.getTasks(filterDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async createTask(
    @Body() createTask: CreateTaskDto,
    @Req() req,
  ): Promise<Task> {
    const user = req.user;
    return this._svc.createTask(createTask, user);
  }

  @Get(':id')
  public async getTaskById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ): Promise<Task> {
    const user = req.user;
    return this._svc.getTaskById(id, user);
  }

  @Delete(':id')
  public async deleteTaskById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ): Promise<DeleteResult> {
    const user = req.user;
    return this._svc.deleteTaskById(id, user);
  }

  @Patch(':id/status')
  public async updateTaskStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Req() req,
  ): Promise<Task> {
    const user = req.user;
    return this._svc.updateTaskStatus(id, status, user);
  }
}
