import {Router, Request, Response} from 'express';
import { AuthController } from './auth.controller';
import errorHandler from '../../shared/errorHandler';
import { successHandler } from '../../shared/successHandler';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const result = await AuthController.login(req.body);
  if (result.error) {
    return errorHandler(res, result.error);
  } else {
    return successHandler(res, result.data, 200);
  }
});

router.post('/register', async (req: Request, res: Response) => {
  const result = await AuthController.register(req.body);
  if (result.error) {
    return errorHandler(res, result.error);
  } else {
    return successHandler(res, result.data, 201);
  }
});

export default router;
