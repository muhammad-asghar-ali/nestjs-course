import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from './interface/task.interface';

@Injectable()
export class TaskStoreService {
  public tasks: Task[] = [];

  public async addTask(task: Task): Promise<Task> {
    return Promise.resolve(task);
  }

  public async getTask(id: string): Promise<Task> {
    const task = this.tasks.filter((i) => i.id === id);
    if (task && task.length > 0) {
      return Promise.resolve(task[0]);
    }
    throw new HttpException('task not found', HttpStatus.NOT_FOUND);
  }

  public async deleteTask(id: string): Promise<Task[]> {
    const task = this.tasks.filter((i) => i.id === id);
    if (task && task.length > 0) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    const newtasks = this.tasks.filter((i) => i.id !== id);
    this.tasks = newtasks;
    return Promise.resolve(this.tasks);
  }

  public async allTasks(): Promise<Task[]> {
    return Promise.resolve(this.tasks);
  }

  public async filterTask(filter: boolean): Promise<Task[]> {
    if (!filter) {
      return Promise.resolve(this.tasks);
    }
    return Promise.resolve(this.tasks.filter((i: Task) => i.duration > 0));
  }
}
