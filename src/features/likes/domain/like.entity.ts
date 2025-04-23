import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { IsEnum, IsString } from 'class-validator';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class LikeStatusEntity {
  @IsString()
  @IsEnum(LikeStatus, { message: 'likeStatus must be Like, Dislike, or None' })
  likeStatus: LikeStatus;
}

@Schema()
export class Like {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop()
  addedAt: string;

  @Prop()
  userId: string;

  @Prop()
  parentId: string;

  @Prop()
  login: string;

  @Prop({ type: String, enum: LikeStatus })
  status: LikeStatus;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.loadClass(Like);

export type LikeDocument = HydratedDocument<Like>;
export type LikeModelType = Model<LikeDocument>;
