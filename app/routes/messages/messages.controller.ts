import { IQueryParamsPayload, IPaginationResponse } from '../../shared/interfaces/pagination.model';
import { MessageModel, IMessageModel, IMessagePayload, validateMessageCreation, IMessageUpdatePayload } from './message.model';
import { IControllerResult } from '../../shared/interfaces/controller-result.model';
import { RoomsController } from '../rooms/rooms.controller';

export const MessagesController = {
  async getByPagination(roomID: string, query: IQueryParamsPayload): Promise<IPaginationResponse<IMessageModel>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;

    const count = await MessageModel.find({ room: roomID }).count();

    const messages = await MessageModel
      .find({ room: roomID })
      .populate({
        path: 'author',
        select: 'profilePicture firstName lastName'
      })
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      count,
      items: messages
    };
  },

  async createMessage(payload: IMessagePayload): Promise<IControllerResult<IMessageModel>> {
    const {error} = validateMessageCreation(payload);
    if (error) {
      return {
        error: {
          statusCode: 400,
          errorMessage: error.details[0].message
        },
        data: null
      };
    }

    const room = await RoomsController.getById(payload.room);
    if (!room) {
      return {
        error: {
          statusCode: 404,
          errorMessage: 'Invalid room id.'
        },
        data: null
      };
    }

    const message = new MessageModel({
      ...payload,
      date: new Date()
    });

    await message.save();

    return {
      error: null,
      data: message
    };
  },

  async editPut(messageID: string, payload: IMessageUpdatePayload): Promise<IControllerResult<IMessageModel>> {
    const message = await MessageModel.findByIdAndUpdate(messageID, {
      message: payload.message,
      updatedDate: new Date()
    }, {new: true});

    if (!message) {
      return {
        error: {
          statusCode: 404,
          errorMessage: 'Message with given id was not found.'
        },
        data: null
      };
    }

    return {
      error: null,
      data: message
    };
  },

  async deleteMessage(messageID: string): Promise<IControllerResult<IMessageModel>> {
    const message = await MessageModel.findByIdAndDelete(messageID);
    if (!message) {
      return {
        error: {
          statusCode: 404,
          errorMessage: 'Message with given id was not found.'
        },
        data: null
      };
    }

    return {
      error: null,
      data: message
    };
  }
};
