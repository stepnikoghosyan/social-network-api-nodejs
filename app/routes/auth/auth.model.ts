import Joi from 'joi';
import { GENDER_TYPE } from '../../constants/userGender.enum';
import { USER_IMAGES_URL } from '../../constants/userImagesUrl';

export interface IAuthPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  gender: GENDER_TYPE;
  isPrivate: boolean;
  profilePicture: string;
  email: string;
  password: string;
  rooms: Array<string>;
}

export interface IAuthResponseModel {
  userId: string;
  firstName: string;
  lastName: string;
  authToken: string;
  refreshToken: string;
  profilePicture: string;
  // readonly last_online: Date;
  // readonly is_online: boolean;
  // readonly friends: Array<UserModel>;
}

export function validateLogin(user: IAuthPayload) {
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };

  return Joi.validate(user, schema);
}

export function validateUser(value: IRegisterPayload) {
  const schema = {
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(3).required(),
      gender: Joi.string().valid(Object.values(GENDER_TYPE)).required(),
      isPrivate: Joi.boolean().default(false),
      profilePicture: Joi.string().default(USER_IMAGES_URL.defaultProfilePicture),
      email: Joi.string().lowercase().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.]+[a-zA-Z0-9-.]+$/).required(),
      password: Joi.string().regex(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)(?=.*[.*+?^$#@!%+=&_{}()|[\W-\]\\]+.*)[0-9a-zA-Z.*+?^$#@!%+=&_{}()|[\W-\]\\]{8,}$/).required()
  };

  return Joi.validate(value, schema);
}
