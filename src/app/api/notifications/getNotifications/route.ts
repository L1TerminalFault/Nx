import { Message } from "@/lib/db";

// import { getIO } from "@/lib/socket";

export async function GET(request: Request) {
  // const io = getIO();
  // console.log("Socket connected: ", io);
  const connectionString = request.url.split("?connectionString=")[1];

  const messages = await Message.find({ connectionString });
  console.log("Messages pulled: ", messages);
  return Response.json({ status: "success", messages });
}
