import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: IOServer | null = null;

export function getIO(server?: HTTPServer) {
  if (io) return io;

  if (!server) {
    throw new Error("HTTP server not ready yet.");
  }

  io = new IOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);
  });

  return io;
}
