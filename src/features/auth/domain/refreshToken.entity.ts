import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema()
export class OldRefreshToken {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  refreshToken: string;
}

export const OldRefreshTokenSchema =
  SchemaFactory.createForClass(OldRefreshToken);

OldRefreshTokenSchema.loadClass(OldRefreshToken);

export type OldRefreshTokenDocument = HydratedDocument<OldRefreshToken>;
export type OldRefreshTokenModel = Model<OldRefreshTokenDocument>;
