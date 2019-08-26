// import socketIO from 'socket.io';
// import * as socketAuth from './auth.middleware';
// import * as connections from './connections';
// import * as messages from './messages';

// let io = null;

// export function initSocket(server) {
//   if (!server) {
//     throw new Error('No server provided for initializing Socket.IO');
//   }
//   if (io) {
//     return;
//   }

//   io = socketIO(server);

//   io.use(socketAuth).on('connection', connectionHandler);
// }

// export function isUserOnline(userId: string) {
//   return connections[userId] ? true : false;
// }

// async function connectionHandler(socket) {
//   if (!socket.user) {
//     console.log('Socket not authenticated.');
//     return;
//   }

//   if (connections[socket.user._id]) {
//     connections[socket.user._id].push(socket.id);
//   } else {
//     connections[socket.user._id] = [socket.id];
//   }

//   console.log('Socket connections:', connections);
//   console.log('Current connection:', connections[decoded._id]);

//   messages(socket);
// }
