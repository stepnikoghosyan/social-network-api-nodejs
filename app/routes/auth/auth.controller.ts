import { compare, genSalt, hash } from 'bcrypt';

// models
import { IAuthPayload, validateLogin, IAuthResponseModel, IRegisterPayload, validateUser } from './auth.model';
import { UserModel } from '../users/user.model';
import { IControllerResult } from '../../shared/interfaces/controller-result.model';
import { USER_IMAGES_URL } from '../../constants/userImagesUrl';

export const AuthController = {
  async login(payload: IAuthPayload): Promise<IControllerResult<IAuthResponseModel>> {
    const { error } = validateLogin(payload);
    if (error) {
      return {
        error: {
          statusCode: 400,
          errorMessage: error.details[0].message,
          field: error.details[0].path[0]
        },
        data: null
      };
    }

    const user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      return {
        error: {
          statusCode: 404,
          errorMessage: 'Invalid email or password.'
        },
        data: null
      };
    }

    const validPassword = await compare(payload.password, user.password);
    if (!validPassword) {
      return {
        error: {
          statusCode: 400,
          errorMessage: 'Invalid email or password.',
        },
        data: null
      };
    }

    const token = await user.generateAuthToken();

    return {
      error: null,
      data: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        authToken: token
      }
    };
  },

  async register(values: IRegisterPayload): Promise<IControllerResult<IAuthResponseModel>> {
    const { error } = validateUser(values);
    if (error) {
      return {
        error: {
          statusCode: 400,
          errorMessage: error.details[0].message,
          field: error.details[0].path[0]
        },
        data: null
      };
    }

    const exists = await UserModel.findOne({ email: values.email });
    if (exists) {
      return {
        error: {
          statusCode: 409,
          errorMessage: 'User with this email already exists.',
          field: 'email'
        },
        data: null
      };
    }

    values.rooms = [];

    const user = new UserModel({
      ...values,
      profilePicture: USER_IMAGES_URL.defaultProfilePicture
    });

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    return {
      error: null,
      data: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        authToken: token
      }
    };
  }
};
