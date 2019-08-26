import {Schema, SchemaTypes, model, Document} from 'mongoose';
import Joi from 'joi';
import JoiObjectId from '../../utils/joiObjectIdValidator.validator';
import { IUserModel } from '../users/user.model';
import { IMessageModel } from '../messages/message.model';

const roomSchema = new Schema({
    name: { type: String, required: true },
    lastMessage: { type: SchemaTypes.ObjectId, required: false, ref: 'Message' },
    isPrivate: { type: Boolean, required: true },
    // participantsCount: { type: Number, required: true },
    updated: { type: Date, required: true },
    users: [{
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }]
});

export function validateRoomCreation(value: IRoomPayload) {
    const schema = {
        name: Joi.string().min(3).required(),
        isPrivate: Joi.boolean().required(),
        // participantsCount: Joi.number().required(),
        updated: Joi.date().required(),
        users: Joi.array().items(JoiObjectId(Joi)).required()
    };

    return Joi.validate(value, schema);
}

// TODO: all .required() are removed, test if this works for PATCH update
export function validateRoomUpdate(value: IRoomUpdatePayload) {
    const schema = {
        name: Joi.string().min(3),
        lastMessage: Joi.string(),
        isPrivate: Joi.boolean(),
        updated: Joi.date(),
        users: Joi.array().items(JoiObjectId(Joi))
        // participantsCount: Joi.number().required()
    };

    return Joi.validate(value, schema);
}

export const RoomModel = model<IRoomModel>('Room', roomSchema);

export interface IRoomModel extends Document {
  name: string;
  lastMessage: string | IMessageModel; // TODO: add IMessageModel
  isPrivate: boolean;
  updated: Date;
  users: Array<string | IUserModel>;
}

export interface IRoomPayload {
  name: string;
  isPrivate: boolean;
  updated: Date;
  users: Array<string>;
}

export interface IRoomUpdatePayload {
  name: string;
  lastMessage: string;
  isPrivate: boolean;
  updated: Date;
  users: Array<string>;
}
