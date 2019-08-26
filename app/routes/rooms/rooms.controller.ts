import { RoomModel, IRoomModel, IRoomPayload, validateRoomCreation } from './room.model';
import { IControllerResult } from '../../shared/interfaces/controller-result.model';
import { IPaginationResponse, IQueryParamsPayload } from '../../shared/interfaces/pagination.model';

export const RoomsController = {
  async getById(roomID: string): Promise<IControllerResult<IRoomModel>> {
    const room = await RoomModel.findById(roomID);
    if (!room) {
      return {
        error: {
          statusCode: 404,
          errorMessage: 'Room with given id was not found.'
        },
        data: null
      };
    }

    return {
      error: null,
      data: room
    };
  },

  async getByPagination(userId: string, queryParams: IQueryParamsPayload): Promise<IPaginationResponse<IRoomModel>> {
    const page = queryParams.page || 1;
    const pageSize = queryParams.pageSize || 5;
    const filterByUpdatedAsc = queryParams.sortByAsc ? 1 : -1;

    const count = await RoomModel.find({users: userId}).count();

    const rooms = await RoomModel
      .find({users: userId})
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'author',
          model: 'User',
          select: 'firstName lastName profilePicture -password'
        }
      })
      .sort({updated: filterByUpdatedAsc})
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      count,
      items: rooms
    };
  },

  async createRoom(userID: string, payload: IRoomPayload): Promise<IControllerResult<IRoomModel>> {
    const values = {
      ...payload,
      updated: new Date()
    };

    if (!payload.users) {
      values.users = [userID];
    }

    const {error} = validateRoomCreation(values);
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

    if (!values.users.includes(userID)) {
      values.users = [userID, ...payload.users];
    }

    const room = new RoomModel(values);
    await room.save();

    return {
      error: null,
      data: room
    };
  },

  async testGetAll() {
    const x = await RoomModel.find();
    return x;
  }
};
