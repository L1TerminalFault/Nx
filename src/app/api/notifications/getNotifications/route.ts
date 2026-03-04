import { Message, AllowedClients } from "@/lib/db";

// import { getIO } from "@/lib/socket";

export async function GET(request: Request) {
  // const io = getIO();
  // console.log("Socket connected: ", io);
  const userName = request.url.split("?userName=")[1].split("&")[0];
  const connectionString = request.url.split("&connectionString=")[1];

  const allowedClients = await AllowedClients.find({ connectionString });

  if (!allowedClients.includes(userName)) {
    console.log(
      `User ${userName} is not allowed to access messages from ${connectionString}. Reason, was not found in ${allowedClients}`,
    );
    return Response.json({
      status: "not allowed",
      error: "You don't have permission. Contact the provider",
    });
  }

  const messages = await Message.find({ connectionString }, null, {
    sort: { time: -1 },
    limit: 15,
  }).lean();
  // console.log("Messages pulled: ", messages);
  return Response.json({ status: "success", messages });
}
