/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { query, Response } from 'express';
import { QueryParamDto, taskDto, TaskParamDto } from './dto/task.dto';
import { Task } from './interface/task.interface';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly _svc: TaskService) {}

  @Get('all')
  async getAllTasks() {
    return await this._svc.allTasks();

    // express way
    // const result = this._svc.allTasks();
    // res.status(200).json({
    //   success: true,
    //   data: result,
    // });
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getTask(@Param() params: TaskParamDto) {
    const data = await this._svc.getTask(params.id);
    return data;
  }

  //filter
  @Get('filter/data')
  @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
  async filterTask(@Query() query: QueryParamDto) {
    const data = await this._svc.filterTask(query.filter);
    return data;
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async deleteTask(@Param() params: TaskParamDto) {
    const data = await this._svc.deleteTask(params.id);
    return data;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createTask(@Body() task: taskDto) {
    return await this._svc.addTask(task);
  }
}
