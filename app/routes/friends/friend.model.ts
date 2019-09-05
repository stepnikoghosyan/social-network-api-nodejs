import { model, Schema, SchemaTypes, Document } from 'mongoose';
import Joi from 'joi';
import JoiObjectId from '../../utils/joiObjectIdValidator.validator';
import { IUserModel } from '../users/user.model';
import { FRIEND_REQUEST_STATUS } from '../../constants/friendRequestStatus.enum';


const friendSchema = new Schema({
  userOne: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'User'
  },
  userTwo: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String, enum: Object.values(FRIEND_REQUEST_STATUS),
    requried: true
  },
  lastActionUser: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'User'
  }
});

export function validateFriendRequest(value: IFriendPayload) {
  const schema = {
    // userOne: JoiObjectId(Joi).required(),
    friendID: JoiObjectId(Joi).required(),
    status: Joi.string().valid(Object.values(FRIEND_REQUEST_STATUS)).required()
  };

  return Joi.validate(value, schema);
}

export function validateFriendDelete(value: IFriendDeletePalyoad) {
  const schema = {
    userID: JoiObjectId(Joi).required,
    friendRequestID: JoiObjectId(Joi),
    friendID: JoiObjectId(Joi)
  };

  return Joi.validate(value, schema);
}

export interface IFriendModel extends Document {
  userOne: string | IUserModel;
  userTwo: string | IUserModel;
  status: FRIEND_REQUEST_STATUS;
  lastActionUser: string | IUserModel;
}

export interface IFriendPayload {
  friendID: string;
  status: FRIEND_REQUEST_STATUS;
}

export interface IFriendDeletePalyoad {
  userID: string;
  friendRequestID: string;
  friendID: string;
}

export const FriendModel = model<IFriendModel>('Friend', friendSchema);
