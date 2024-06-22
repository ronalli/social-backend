import { HydratedDocument, Model, Types} from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike'
}

@Schema()
export class Like {
  @Prop()
  addedAt: string;

  @Prop()
  userId: string;

  @Prop()
  parentId: string;

  @Prop()
  login: string

  @Prop({type: String, enum: LikeStatus})
  status: LikeStatus
}

export const LikeSchema = SchemaFactory.createForClass(Like)
LikeSchema.loadClass(Like);

export type LikeDocument = HydratedDocument<Like>
export type LikeModelType = Model<LikeDocument>
