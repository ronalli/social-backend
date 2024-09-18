import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema()
export class RateLimitEntity {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  date: number;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  ip: string;
}

export const RateLimitEntitySchema =
  SchemaFactory.createForClass(RateLimitEntity);

export type RateLimitEntityDocument = HydratedDocument<RateLimitEntity>;
export type RateLimitEntityModel = Model<RateLimitEntityDocument>;
