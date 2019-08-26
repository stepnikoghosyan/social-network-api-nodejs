// import { verify } from 'jsonwebtoken';
// import config from '../config/config';
// import { UsersController } from '../routes/users/users.controller';

// export default async function(socket: SocketIO.Socket, next) {
//   if (socket.handshake.query) {
//     try {
//       const decoded = verify(socket.handshake.query.token, config.get('jwtPrivateKey'));
//       if (!decoded) {
//         return null;
//       }

//       // query db
//       const user = await UsersController.getUserById(decoded._id);
//       if (!user) {
//         return null;
//       }

//       socket.user = decoded;
//     } catch (ex) {
//       next(ex);
//     }
//   } else {
//     next(new Error('Authentication error'));
//   }
// }
