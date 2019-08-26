// core
import express from 'express';
import http from 'http';
import morgan from 'morgan';

// startup functions
import configureDB from './startup/db';
import configureRoutes from './startup/routes';
// import configureSocket from './startup/socket';

const app = express();
const server = new http.Server(app);

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

app.use(morgan('tiny'));

// routes
configureDB();
configureRoutes(app);


const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
