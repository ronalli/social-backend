// import { HydratedDocument, Model, Types } from 'mongoose';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { BlogSchema } from '../../blogs/domain/blog.entity';
//
// @Schema()
// export class Post {
//   @Prop({ type: Types.ObjectId, auto: true })
//   _id: Types.ObjectId;
//
//   @Prop()
//   title: string;
//
//   @Prop()
//   shortDescription: string;
//
//   @Prop()
//   content: string;
//
//   @Prop()
//   blogId: string;
//
//   @Prop()
//   blogName: string;
//
//   @Prop()
//   createdAt: string;
//
//   @Prop()
//   likesCount: number;
//
//   @Prop()
//   dislikesCount: number;
// }
//
// export const PostSchema = SchemaFactory.createForClass(Post);
// BlogSchema.loadClass(Post);
//
// export type PostDocument = HydratedDocument<Post>;
// export type PostModelType = Model<PostDocument>;
