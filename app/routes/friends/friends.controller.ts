import { IQueryParamsPayload, IPaginationResponse } from '../../shared/interfaces/pagination.model';
import { IControllerResult } from '../../shared/interfaces/controller-result.model';
import { IFriendModel, FriendModel, validateFriendRequest, IFriendPayload, validateFriendUpdate, IFriendDeletePalyoad } from './friend.model';
import { FRIEND_REQUEST_STATUS } from '../../constants/friendRequestStatus.enum';

const ErrorMessages: { [key: string]: string } = {
  PENDING: 'You or Your friend have already sent a request.',
  ACCEPTED: 'You are already friends.',
  BLOCKED: 'You cannot send friend request to this user.'
};

export const FriendsController = {
  async getFriendsByPagination(userID: string, params: IQueryParamsPayload): Promise<IPaginationResponse<IFriendModel>> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    const dbQuery = {
      $and: [
        {
          $or: [
            { userOne: userID },
            { userTwo: userID }
          ]
        },
        { status: FRIEND_REQUEST_STATUS.ACCEPTED }
      ]
    };

    const count = await FriendModel
      .find(dbQuery)
      .countDocuments();

    const friends = await FriendModel
      .find(dbQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      count,
      items: friends
    };
  },

  async getPendingRequestsByPagination(userID: string, params: IQueryParamsPayload): Promise<IPaginationResponse<IFriendModel>> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    const dbQuery = {
      $and: [
        {
          $or: [{ userOne: userID }, { userTwo: userID }]
        },
        { status: FRIEND_REQUEST_STATUS.PENDING }
      ]
    };

    const count = await FriendModel.find(dbQuery).countDocuments();

    const list = await FriendModel
      .find(dbQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      count,
      items: list
    };
  },

  // create a new record (send friend request)
  async createFriendRequest(userID: string, friendID: string, status: FRIEND_REQUEST_STATUS): Promise<IControllerResult<IFriendModel>> {
    const { error } = validateFriendRequest({ friendID, status });
    if (error) {
      return {
        data: null,
        error: {
          errorMessage: error.details[0].message,
          statusCode: 400
        }
      };
    }

    const { userOne, userTwo } = userID <= friendID ? { userOne: userID, userTwo: friendID } : { userOne: friendID, userTwo: userID };

    const exists = await FriendModel.findOne({ userOne, userTwo, status: { $ne: FRIEND_REQUEST_STATUS.REJECTED } });
    if (exists) {
      return {
        data: null,
        error: {
          errorMessage: ErrorMessages[exists.status] || 'HOPAR',
          statusCode: 400
        }
      };
    }

    const friendRequest = new FriendModel({
      userOne,
      userTwo,
      status,
      lastActionUser: userID
    });

    await friendRequest.save();

    return {
      data: friendRequest,
      error: null
    };
  },

  // accept/reject/block a user
  async updateFriend(userID: string, friendRequestID: string, data: IFriendPayload): Promise<IControllerResult<IFriendModel>> {
    const { userOne, userTwo } = userID < data.friendID ? { userOne: userID, userTwo: data.friendID } : { userOne: data.friendID, userTwo: userID };

    const { error } = validateFriendRequest(data);
    if (error) {
      return {
        data: null,
        error: {
          errorMessage: error.details[0].message,
          statusCode: 400
        }
      };
    }

    const updated = await FriendModel.findOneAndUpdate({ _id: friendRequestID, userOne, userTwo }, { status: data.status }, { new: true });
    if (!updated) {
      return {
        data: null,
        error: {
          errorMessage: 'Given users are not friends.',
          statusCode: 400
        }
      };
    }

    return {
      data: updated,
      error: null
    };
  },

  // userID: string, friendRequestID: string, friendID: string
  async deleteFriend(payload: IFriendDeletePalyoad): Promise<IControllerResult<IFriendModel>> {
    const { userOne, userTwo } = payload.userID < payload.friendID ?
      {userOne: payload.userID, userTwo: payload.friendID} : { userOne: payload.friendID, userTwo: payload.userID };

    const data = await FriendModel.findOneAndDelete({ _id: payload.friendRequestID, userOne, userTwo});
    if (!data) {
      return {
        data: null,
        error: {
          errorMessage: 'Friendship record not found.',
          statusCode: 404
        }
      };
    }

    return {
      data,
      error: null
    };
  }
};
