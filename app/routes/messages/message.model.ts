import {model, Schema, SchemaTypes, Document} from 'mongoose';
import Joi from 'joi';
import JoiObjectId from '../../utils/joiObjectIdValidator.validator';
import { IRoomModel } from '../rooms/room.model';
import { IUserModel } from '../users/user.model';

const messageSchema = new Schema({
    room: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'Room'
    },
    message: { type: String, required: true },
    date: { type: Date, required: true },
    author: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    updatedDate: {
        type: Date,
        required: false
    }
});

export function validateMessageCreation(value: IMessagePayload): Joi.ValidationResult<IMessagePayload>  {
    const schema = {
        message: Joi.string().required(),
        room: JoiObjectId(Joi).required(),
        date: Joi.date().required(),
        author: JoiObjectId(Joi).required(),
        updatedDate: Joi.date()
    };

    return Joi.validate(value, schema);
}

export function validateMessageUpdate(value: IMessageUpdatePayload): Joi.ValidationResult<IMessageUpdatePayload> {
    const schema = {
        message: Joi.string().required(),
        updatedDate: Joi.date()
    };

    return Joi.validate(value, schema);
}

export const MessageModel = model<IMessageModel>('Message', messageSchema);

export interface IMessageModel extends Document {
  room: string | IRoomModel;
  message: string;
  date: Date;
  author: string | IUserModel;
  updatedDate: Date;
}

export interface IMessagePayload {
  message: string;
  room: string;
  date: Date;
  author: string;
  updatedDate: Date;
}

export interface IMessageUpdatePayload {
  message: string;
  updatedDate: Date;
}
