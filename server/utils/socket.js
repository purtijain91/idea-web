//socket.js

let io;

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: { origin: "http://localhost:3001", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // Join a chat room (room = combination of user ids)
    socket.on("joinroom", (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    //listenfor new message
    socket.on("sendMessage", ({ roomId, message }) => {
      io.to(roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initSocket, getIO };
