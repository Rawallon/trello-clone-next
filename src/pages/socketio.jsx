import { useEffect } from 'react';
import io from 'socket.io-client';

import React from 'react';

export default function Socketio() {
  let socket;
    if (typeof window !== 'undefined') {
      fetch('/api/socketio').finally(() => {
        socket = io();
        socket.on('connect', () =>
          console.log('[IO] Connect => A new connection has been established'),
        );
        socket.on('disconnect', () =>
          console.log('[IO] Disconnect => A connection has been terminated'),
        );

        socket.on('moveList', (data) => {
          console.log('moveList', data);
        });

        socket.on('a user connected', () => {
          console.log('a user connected');
        });

        socket.on('disconnect', () => {
          console.log('disconnect');
        });
      });
    }
  console.log(socket);

  function test() {
    console.log(socket);
    socket.emit('moveList', {
      cardId: '932837784-888936815',
      toId: '974686224-909630349',
      insertIndex: 0,
      toId: '974686224-909630349',
    });
  }
  return (
    <h1>
      Socket.io
      <button onClick={test}>test</button>
    </h1>
  );
}
