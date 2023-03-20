import {
  Controller,
  Get,
  Post,
  Res,
  HttpStatus,
  Param,
  Delete,
  Put,
  Query,
  Body,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { Response } from 'express';
import { CreateCustomerDTO, CustomerParamDTO } from '../dto/customer.dto';

// REQUEST VLIDATION

@Controller('customers')
export class CustomerController {
  constructor(private readonly _svc: CustomerService) {}

  @Get()
  async getAllCustomers(@Res() res: Response) {
    try {
      const result = await this._svc.listCustomer();
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  @Post()
  async createCustomers(
    @Res() res: Response,
    @Body() customerParam: CreateCustomerDTO,
  ) {
    try {
      const result = await this._svc.createCustomer(customerParam);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  @Get('/:id')
  async getCustomerById(@Param() param: CustomerParamDTO) {
    return await this._svc.getCustomer(param.customerId);
  }

  @Delete()
  async deleteCustomerById(@Query('customerid') id: string) {
    return await this._svc.getCustomer(id);
  }

  @Put()
  async updateCustomerById(
    @Res() res: Response,
    @Body() customerParam: Partial<CreateCustomerDTO>,
    @Query('customerid') id: string,
  ) {
    const result = await this._svc.updateCustomer(id, customerParam);
    res.status(HttpStatus.OK).json({ success: true, data: result });
  }
}
