import { Schema, model, Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { GENDER_TYPE } from '../../constants/userGender.enum';
import { USER_IMAGES_URL } from '../../constants/userImagesUrl';
import { IQueryParamsPayload } from '../../shared/interfaces/pagination.model';

const userSchema = new Schema({
    username: { type: String, required: false },
    firstName: { type: String, minlength: 3, required: true },
    lastName: { type: String, minlength: 3, required: true },
    gender: { type: String, enum: Object.values(GENDER_TYPE), required: true },
    isPrivate: { type: Boolean, default: false },
    profilePicture: { type: String, default: USER_IMAGES_URL.defaultProfilePicture },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate: {
            validator(val: string) {
                return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.]+[a-zA-Z0-9-.]+$/.test(val);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator(val: string) {
                // tslint:disable-next-line: max-line-length
                return /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)(?=.*[.*+?^$#@!%+=&_{}()|[\W-\]\\]+.*)[0-9a-zA-Z.*+?^$#@!%+=&_{}()|[\W-\]\\]{8,}$/.test(val);
            }
        }
    }
});

userSchema.methods.generateAuthToken = function(): string {
    const token = jwt.sign({
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        gender: this.gender
    }, config.get('jwtPrivateKey'), {expiresIn: '7d'});
    return token;
};

userSchema.methods.getImagesUrl = function(): string {
    return `${USER_IMAGES_URL.USER_DATA_BASE}${this._id}/${USER_IMAGES_URL.USER_IMAGES_URL_BASE}`;
};

export const UserModel = model<IUserModel>('User', userSchema);

export interface IUserModel extends Document {
    firstName: string;
    lastName: string;
    gender: string;
    isPrivate: boolean;
    profilePicture: string;
    email: string;
    password: string;
    generateAuthToken: () => string;
    getImagesUrl: () => string;
}

export interface ISearchUserQueryParams extends IQueryParamsPayload {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
}
