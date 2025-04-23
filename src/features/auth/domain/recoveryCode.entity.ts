import { HydratedDocument, Model, Types } from 'mongoose';
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

@Schema()
export class RecoveryCode {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  code: string;
}

export const RecoveryCodeSchema = SchemaFactory.createForClass(RecoveryCode);

RecoveryCodeSchema.loadClass(RecoveryCode);

export type RecoveryCodeDocument = HydratedDocument<RecoveryCode>;
export type RecoveryCodeType = Model<RecoveryCodeDocument>;
