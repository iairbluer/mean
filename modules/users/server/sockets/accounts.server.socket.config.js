'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  module.exports.IO = io;
//   io.emit('chatMessage', {
//     type: 'status',
//     text: 'Is now connected',
//     created: Date.now(),
//     profileImageURL: socket.request.user.profileImageURL,
//     username: socket.request.user.username
//   });

  // When Account Connected Update the Account - by customer id;
  socket.on('accountConnected', function (account) {
    console.log('ACCOUNT CONNECTED - ' + JSON.stringify(account));


    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username
    });
  });
};
