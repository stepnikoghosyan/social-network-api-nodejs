import {Router, Request, Response} from 'express';
const router = Router();

// handlers
import { successHandler } from '../../shared/successHandler';

// middlewares
import auth from '../../middleware/auth.middleware';

// controllers
import {RoomsController} from './rooms.controller';
import errorHandler from '../../shared/errorHandler';

router.get('/test', async (req: Request, res: Response) => {
  const rooms = await RoomsController.testGetAll();
  return successHandler(res, rooms, 200);
});

router.get('/', auth, async (req, res) => {
  const rooms = await RoomsController.getByPagination(req.user._id, req.query);
  return successHandler(res, rooms, 200);
});

router.post('/', auth, async (req: Request, res: Response) => {
  const result = await RoomsController.createRoom(req.user._id, req.body);
  if (result.error) {
    return errorHandler(res, result.error);
  }

  return successHandler(res, result.data, 201);
});

export default router;
