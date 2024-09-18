import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema()
export class DeviceEntity {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  exp: string;

  @Prop({ required: true })
  iat: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  userId: string;
}

export const DeviceEntitySchema = SchemaFactory.createForClass(DeviceEntity);

DeviceEntitySchema.loadClass(DeviceEntity);

export type DeviceEntityDocument = HydratedDocument<DeviceEntity>
export type DeviceEntityModel = Model<DeviceEntityDocument>

