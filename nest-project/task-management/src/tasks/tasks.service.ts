import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.tdo';
import { TaskEntity } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private _repo: Repository<TaskEntity>,
  ) {}

  public async getTaskById(id: string, user: UserEntity): Promise<Task> {
    const task = await this._repo.findOne({ where: { id, userId: user.id } });

    if (!task) {
      throw new HttpException('no task found', HttpStatus.NOT_FOUND);
    }

    return task;
  }

  public async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this._repo.createQueryBuilder('tasks');

    query.where('tasks.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('tasks.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(tasks.title LIKE :search OR tasks.desciption LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();

      return tasks;
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  public async createTask(
    createTask: CreateTaskDto,
    user: UserEntity,
  ): Promise<Task> {
    const { title, description } = createTask;
    const task = {
      title,
      description,
      user,
      userId: user.id,
      status: TaskStatus.OPEN,
    };
    try {
      const result = await this._repo.save(task);
      delete result.user;
      return result;
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  public async getAllTasks(): Promise<Task[]> {
    return this._repo.find();
  }

  public async deleteTaskById(
    id: string,
    user: UserEntity,
  ): Promise<DeleteResult> {
    const result = await this._repo
      .createQueryBuilder()
      .delete()
      .from(TaskEntity)
      .where('id = :id', { id, userId: user.id })
      .execute();

    if (result.affected === 0) {
      throw new HttpException('no task found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  public async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this._repo.save(task);
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
