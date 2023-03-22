import { Injectable } from '@nestjs/common';
import { Cat } from './cat.interface';

@Injectable()
export class CatService {
  private readonly cats: Cat[] = [];
  getAllCats(): Cat[] {
    return this.cats;
  }

  createCat(cat: Cat): Cat {
    this.cats.push(cat);
    return cat;
  }

  removeCat() {
    return 'Hello World!';
  }
}
