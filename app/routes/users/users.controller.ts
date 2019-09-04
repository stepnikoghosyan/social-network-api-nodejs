import { UserModel, ISearchUserQueryParams, IUserModel } from './user.model';
import { Document } from 'mongoose';
import { IPaginationResponse } from '../../shared/interfaces/pagination.model';

export const UsersController = {
  async getUserById(id: string): Promise<IUserModel | null> {
    const user = await UserModel.findById(id).populate('rooms').select('-password');
    if (!user) {
      return null;
    }

    return user;
  },

  async searchUsers(params: ISearchUserQueryParams): Promise<IPaginationResponse<IUserModel>> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 5;

    const allowedSearchFields = [
      'firstName',
      'lastName',
      'username',
      'email'
    ];
    const filters: Array<{ [key: string]: string }> = [];
    allowedSearchFields.forEach((item: string) => {
      if (params[item]) {
        const filter = Object.create(null);
        filter[item] = { $regex: '.*' + params[item] + '.*' };
        filters.push(filter);
      }
    });

    const count = await UserModel.find({$or: filters}).countDocuments();

    const users = await UserModel
      .find({ $or: filters })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return {
      count,
      items: users
    };
  }
};
