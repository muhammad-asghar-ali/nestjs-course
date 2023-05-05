import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  private async _hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async _doesUserExist(email: string): Promise<User> {
    return this._repo.findOne({ where: { email } });
  }

  private async _comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private async _validateUser(email: string, password: string): Promise<User> {
    const user = await this._doesUserExist(email);

    if (!user) {
      throw new HttpException('Invalid Credentials', HttpStatus.FORBIDDEN);
    }

    const isPasswordMatched = await this._comparePassword(
      password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new HttpException('Invalid Credentials', HttpStatus.FORBIDDEN);
    }

    delete user.password;
    return user;
  }

  public async register(user: User): Promise<User> {
    const alredyExist = await this._doesUserExist(user.email);

    if (alredyExist) {
      throw new HttpException('user already exist', HttpStatus.CONFLICT);
    }
    const hashedPassword = await this._hashPassword(user.password);

    user.password = hashedPassword;

    const userCreated = await this._repo.save(user);

    userCreated.password = undefined;

    return userCreated;
  }

  public async login(user: User): Promise<string> {
    const validateUser = await this._validateUser(user.email, user.password);
    if (validateUser) {
      // create JWT - credentials
      return this.jwtService.signAsync({ validateUser });
    }
  }

  public async getJwtUser(jwt: string): Promise<User | null> {
    const user = await this.jwtService.verifyAsync(jwt);

    return user;
  }
}
