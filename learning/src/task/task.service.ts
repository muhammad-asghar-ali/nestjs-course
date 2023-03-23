import { Injectable } from '@nestjs/common';
import { Task } from './interface/task.interface';
import { TaskStoreService } from './task-store.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
  constructor(private readonly _taskStoreSvc: TaskStoreService) {}

  public async addTask(task: Task): Promise<Task> {
    task.id = uuidv4();
    task.completed = false;
    task.description = 'dummy';
    task.owner = 'test';
    task.duration = 2;
    return this._taskStoreSvc.addTask(task);
  }

  public async getTask(id: string): Promise<Task> {
    return this._taskStoreSvc.getTask(id);
  }

  public async deleteTask(id: string): Promise<Task[]> {
    return this._taskStoreSvc.deleteTask(id);
  }

  public async allTasks(): Promise<Task[]> {
    return await this._taskStoreSvc.allTasks();
  }

  public async filterTask(filter: boolean): Promise<Task[]> {
    return this._taskStoreSvc.filterTask(filter);
  }
}
