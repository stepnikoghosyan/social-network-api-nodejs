import { Router, Request, Response } from 'express';
const router = Router();

// handlers
import { successHandler } from '../../shared/successHandler';
import errorHandler from '../../shared/errorHandler';

// controllers
import { MessagesController } from './messages.controller';
import validateObjectId from '../../middleware/validateObjectId.middleware';
import { RoomsController } from '../rooms/rooms.controller';

router.get('/:id', validateObjectId, async (req: Request, res: Response) => {
  // id -> room id
  const result = await RoomsController.getById(req.params.id);
  if (result.error) {
    return errorHandler(res, result.error);
  }

  const messages = await MessagesController.getByPagination(req.params.id, req.query);
  return successHandler(res, messages, 200);
});

router.post('/', async (req: Request, res: Response) => {
  const result = await MessagesController.createMessage(req.body);
  if (result.error) {
    return errorHandler(res, result.error);
  }

  return successHandler(res, result.data, 201);
});

router.put('/:id', validateObjectId, async (req: Request, res: Response) => {
  const result = await MessagesController.editPut(req.params.id, req.body);
  if (result.error) {
    return errorHandler(res, result.error);
  }

  return successHandler(res, result.data, 200);
});

router.delete('/:id', validateObjectId, async (req: Request, res: Response) => {
  const result = await MessagesController.deleteMessage(req.params.id);
  if (result.error) {
    return errorHandler(res, result.error);
  }

  return successHandler(res, result.data, 204); // TODO: should i change this ?
});

export default router;
