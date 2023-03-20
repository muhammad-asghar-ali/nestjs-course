import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../interface/customer.interface';
import { CreateCustomerDTO } from '../dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private readonly _model: Model<Customer>,
  ) {}

  public async listCustomer(): Promise<Customer[]> {
    return await this._model.find({});
  }

  public async createCustomer(customer: CreateCustomerDTO): Promise<Customer> {
    const newCustomer = new this._model(customer);
    return newCustomer.save();
  }

  public async updateCustomer(
    id: string,
    customerDto: Partial<CreateCustomerDTO>,
  ): Promise<Customer> {
    const updatedCustomer = await this._model.findByIdAndUpdate(
      id,
      customerDto,
      { new: true },
    );
    return updatedCustomer;
  }

  public async getCustomer(id: string): Promise<Customer> {
    const customer = await this._model.findById(id).exec();
    if (!customer) {
      throw new NotFoundException('customer not found');
    }
    return customer;
  }

  public async removeCustomer(id: string): Promise<Customer[]> {
    try {
      return await this._model.findByIdAndRemove(id);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
