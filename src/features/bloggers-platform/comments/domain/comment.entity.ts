import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class CommentatorInfo {
  @Prop()
  userId: string;

  @Prop()
  userLogin: string;
}

@Schema()
export class Comment {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop()
  content: string;

  @Prop()
  createdAt: string;

  @Prop()
  postId: string;

  @Prop({ type: CommentatorInfo })
  commentatorInfo: CommentatorInfo;

  @Prop()
  likesCount: number;

  @Prop()
  dislikesCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;
export type CommentModelType = Model<CommentDocument>;
