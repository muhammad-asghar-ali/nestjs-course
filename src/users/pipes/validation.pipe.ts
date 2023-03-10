/* eslint-disable @typescript-eslint/no-unused-vars */
// Pipes
// A pipe is a class annotated with the @Injectable() decorator, which implements the PipeTransform interface.

// transformation: transform input data to the desired form (e.g., from string to integer)
// validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception.

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed in request payload');
    }
    return value;
  }
}
