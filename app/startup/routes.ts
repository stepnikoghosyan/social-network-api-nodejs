import express, { Request, Response } from 'express';
import {join} from 'path';
import cors from 'cors';

// middlewares
import auth from '../middleware/auth.middleware';

// routes
import swagger from './swagger';
import authRoutes from '../routes/auth/auth.router';
import usersRoutes from '../routes/users/users.router';
import roomsRoutes from '../routes/rooms/rooms.router';
import messagesRoutes from '../routes/messages/messages.router';
import friendsRoutes from '../routes/friends/friends.router';
import errorHandler from '../shared/errorHandler';

export default function(app: express.Application) {
    app.use(cors());

    app.use(express.json());

    // swagger
    swagger(app);

    app.use('/static', express.static('app/static'));

    // routes
    app.use('/v0/auth', authRoutes);
    app.use('/v0/users', auth, usersRoutes);
    app.use('/v0/rooms', roomsRoutes);
    app.use('/v0/messages', messagesRoutes);
    app.use('/v0/friends', auth, friendsRoutes);

    app.use('*', (req: Request, res: Response) => {
      return errorHandler(res, {
        errorMessage: `Route '${req.url}' Not found.`,
        statusCode: 404
      });
    });
}
