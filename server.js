const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log("Connection established ",socket.id);

      socket.on("join-room", (roomId, id, name) => {
        console.log(`A new user ${id} has joined the room ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected", id, name);
      });

      socket.on("user-toggle-audio",(userId,roomId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit("user-toggle-audio",userId)
      });

      socket.on("user-toggle-video",(userId,roomId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit("user-toggle-video",userId)
      });

      socket.on("user-leave", (userId, roomId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-leave", userId);
      });

});

httpServer.listen(5000,()=>console.log("Server listening on port 5000"));
