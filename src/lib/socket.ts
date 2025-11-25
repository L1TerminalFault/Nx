import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export function getIO() {
  if (io) return io;

  io = new IOServer(30000, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);
  });

  return io;
}
