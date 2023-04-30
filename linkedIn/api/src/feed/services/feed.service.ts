import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedEntity } from '../models/post.entity';
import { FeedPost } from '../models/post.interface';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedEntity)
    private readonly _repe: Repository<FeedEntity>,
  ) {}

  public async create(feed: FeedPost): Promise<FeedPost> {
    return await this._repe.save(feed);
  }

  public async findById(id: string): Promise<FeedPost> {
    return await this._repe.findOneBy({ id });
  }

  public async all(): Promise<FeedPost[]> {
    return await this._repe.find();
  }

  public async delete(id: string): Promise<any> {
    return await this._repe.delete({ id });
  }

  public async update(id: string, body: string): Promise<any> {
    return await this._repe.update({ id }, { body });
  }
}
