import { Message } from "@/lib/db";

import { getIO } from "@/lib/socket";

export async function POST(request: Request) {
  const message = await request.json();

  console.log("Message Recieved: ", message);
  await Message.create(message);

  const io = getIO();
  io.emit("message", message);

  return Response.json({ status: "success" });
}
