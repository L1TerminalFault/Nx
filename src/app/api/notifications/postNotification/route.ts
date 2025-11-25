import { Message } from "@/lib/db";

import { getIO } from "@/lib/socket";

type Message = { userId: string; message: string; time: string };
export async function POST(request: Request) {
  const message: Message = await request.json();

  console.log("Message Recieved: ", message);
  const messageRtr: Message = await Message.create(message);

  const io = getIO();
  io.emit("message", { ...message, _id: messageRtr._id });

  return Response.json({ status: "success" });
}
