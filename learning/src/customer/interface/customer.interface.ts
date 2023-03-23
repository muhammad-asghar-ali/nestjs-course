import { Document } from 'mongoose';

export interface Customer extends Document {
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly phone: string;
  readonly description: string;
  readonly address: string;
  readonly created_at: Date;
}
