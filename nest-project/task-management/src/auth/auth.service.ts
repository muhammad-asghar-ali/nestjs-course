import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private _repo: Repository<UserEntity>,
    private _jwt: JwtService,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public async validatePassword(authDto: AuthDto): Promise<string> {
    const { username, password } = authDto;
    const user = await this._repo.findOne({ where: { username } });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  public async signUp(authDto: AuthDto): Promise<void> {
    const { username, password } = authDto;

    const user = new UserEntity();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async signIn(authDto: AuthDto): Promise<{ accessToken: string }> {
    const username = await this.validatePassword(authDto);

    if (!username) {
      throw new UnauthorizedException('invalid credientials');
    }

    const payload: JwtPayload = { username };

    const accessToken = await this._jwt.sign(payload);
    return { accessToken };
  }
}
