import { Message } from "@/lib/db";

import { getIO } from "@/lib/socket";

export async function GET() {
  const io = getIO();
  console.log("Socket connected: ", io);

  const messages = await Message.find();
  console.log("Messages pulled: ", messages);
  return Response.json({ status: "success", messages });
}
