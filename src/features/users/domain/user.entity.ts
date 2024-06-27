import { HydratedDocument, Model, Types} from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class EmailConfirmation {
  @Prop({ type: String, default: null })
  confirmationCode: string | null;

  @Prop({ type: Date, default: null })
  expirationDate: Date | null;

  @Prop({ type: Boolean, default: false })
  isConfirmed?: boolean;
}

const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);

@Schema()
export class User {
  @Prop({type: Types.ObjectId, auto: true})
  _id: Types.ObjectId;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  hash: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({type: EmailConfirmationSchema})
  emailConfirmation: EmailConfirmation
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>

export type UserModelType = Model<UserDocument>