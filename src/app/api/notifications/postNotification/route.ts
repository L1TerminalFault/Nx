import { Message } from "@/lib/db";

import { getIO } from "@/lib/socket";

export async function POST(request: Request) {
  const message: { userId: string; message: string; time: string } =
    await request.json();

  console.log("Message Recieved: ", message);
  await Message.create(message);

  const io = getIO();
  io.emit("message", { ...message, _id: 1 });

  return Response.json({ status: "success" });
}
