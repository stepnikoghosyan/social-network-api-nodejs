import { UserModel, ISearchUserQueryParams } from './user.model';
import { Document } from 'mongoose';

export const UsersController = {
  async getUserById(id: string): Promise<Document | null> {
    const user = await UserModel.findById(id).populate('rooms').select('-password');
    if (!user) {
      return null;
    }

    return user;
  },

  async searchUsers(params: ISearchUserQueryParams): Promise<Document[]> {
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

    const users = await UserModel
      .find({ $or: filters })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return users;
  }
};
