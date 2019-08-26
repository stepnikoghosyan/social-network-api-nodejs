import {SOCKET_EVENTS} from '../constants/socketEvents';
import { Socket } from 'socket.io';

export default function(socket: Socket) {
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (message: string) => {
    // const result = await messagesRepo.post(message, req.user.id);

    // if (result.error) {
    //     connections[socket.user._id].forEach(socketID => {
    //         io.to(`${socketID}`).emit(EVENTS.MESSAGE_NOT_SENT, message);
    //     });
    // } else {
    //     socket.emit(EVENTS.NEW_RECEIVED_MESSAGE, message);
    //     connections[socket.user._id].forEach(socketID => {
    //         io.to(`${socketID}`).emit(EVENTS.MESSAGE_SENT, message);
    //     });
    // }
  });
}
