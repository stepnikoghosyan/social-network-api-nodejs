import { Router, Request, Response } from 'express';
const router = Router();

// handlers
import { successHandler } from '../../shared/successHandler';
import errorHandler from '../../shared/errorHandler';

// controllers
import { FriendsController } from './friends.controller';
import { IFriendPayload, IFriendDeletePalyoad } from './friend.model';
import validateObjectIdMiddleware from '../../middleware/validateObjectId.middleware';

router.get('/', async (req, res) => {
  const friends = await FriendsController.getFriendsByPagination(req.user._id, req.query);
  return successHandler(res, friends, 200);
});

router.get('/pending', async (req, res) => {
  const pendingRequests = await FriendsController.getPendingRequestsByPagination(req.user._id, req.query);
  return successHandler(res, pendingRequests, 200);
});

router.post('/', async (req, res) => {
  const payload: IFriendPayload = req.body;
  const result = await FriendsController.createFriendRequest(req.user._id, payload.friendID, payload.status);
  if (result.error) {
    return errorHandler(res, result.error);
  }

  return successHandler(res, result.data, 201);
});

router.put('/:id', validateObjectIdMiddleware, async (req, res) => {
  const payload: IFriendPayload = req.body;
  const result = await FriendsController.updateFriend(req.user._id, req.params.id, payload);
  if (result.error) {
    return errorHandler(res, result.error);
  }

  return successHandler(res, result.data, 200);
});

router.delete('/:id', validateObjectIdMiddleware, async (req, res) => {
  const payload: IFriendDeletePalyoad = {
    userID: req.user._id,
    friendID: req.body.friendID,
    friendRequestID: req.params.id
  };

  const result = await FriendsController.deleteFriend(payload);
  if (result.error) {
    return errorHandler(res, result.error);
  }

  return successHandler(res, result.data, 204);  // TODO: should i change this ?
});

export default router;
