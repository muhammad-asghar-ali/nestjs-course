import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.tdo';
import { TaskEntity } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private _repo: Repository<TaskEntity>,
  ) {}

  public async getTaskById(id: string): Promise<Task> {
    const task = await this._repo.findOne({ where: { id } });

    if (!task) {
      throw new HttpException('no task found', HttpStatus.NOT_FOUND);
    }

    return task;
  }

  public async createTask(createTask: CreateTaskDto): Promise<Task> {
    const { title, description } = createTask;
    const task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    const result = await this._repo.save(task);
    return result;
  }

  public async getAllTasks(): Promise<Task[]> {
    return this._repo.find();
  }

  public async deleteTaskById(id: string): Promise<DeleteResult> {
    const result = await this._repo
      .createQueryBuilder()
      .delete()
      .from(TaskEntity)
      .where('id = :id', { id })
      .execute();

    return result;
  }

  public async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;

    return task;
  }

  // private tasks: Task[] = [];

  // public getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // public getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;

  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }

  //   return tasks;
  // }

  // public createTask(createTask: CreateTaskDto): Task {
  //   const { title, description } = createTask;
  //   const task: Task = {
  //     id: uuidv4(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  // public getTaskById(id: string): Task {
  //   const task = this.tasks.find((task) => task.id === id);

  //   if (!task) {
  //     throw new HttpException('no task found', HttpStatus.NOT_FOUND);
  //   }

  //   return task;
  // }

  // public deleteTaskById(id: string): Task {
  //   const task = this.getTaskById(id);

  //   this.tasks.filter((task) => task.id !== id);

  //   return task;
  // }

  // public updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);

  //   task.status = status;

  //   return task;
  // }
}
