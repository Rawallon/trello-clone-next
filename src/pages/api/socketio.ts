import { Server } from 'socket.io';

interface msgType {
  id: string;
  data: any;
}

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('[WS] => First use, starting socket.io server');

    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
      });
      const actions = [
        'moveList',
        'updateListTitle',
        'archiveList',
        'createList',
        'moveCard',
        'archiveCard',
        'updateCardData',
        'createCard',
      ];
      for (const action of actions) {
        socket.on(action, (msg: msgType) => {
          socket.broadcast.to(msg.id).emit(action, msg.data ?? null);
        });
      }
      // socket.broadcast.emit('a user connected');
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
