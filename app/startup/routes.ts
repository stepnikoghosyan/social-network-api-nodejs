import express, { Request, Response } from 'express';
import cors from 'cors';

// middlewares
import auth from '../middleware/auth.middleware';

// routes
import authRoutes from '../routes/auth/auth.router';
import usersRoutes from '../routes/users/users.router';
import roomsRoutes from '../routes/rooms/rooms.router';

export default function(app: express.Application) {
    app.use(cors());

    app.use(express.json());

    app.use('/static', express.static('static'));

    // routes
    app.use('/auth', authRoutes);
    app.use('/users', auth, usersRoutes);
    app.use('/rooms', roomsRoutes);

    app.use('*', (req: Request, res: Response) => {
      return res.status(404).send('Not found.');
    });
}
