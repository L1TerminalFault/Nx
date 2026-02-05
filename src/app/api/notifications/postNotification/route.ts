import { Message } from "@/lib/db";
// import { NextResponse as Response } from "next/server";

// import { getIO } from "@/lib/socket";

type Message = {
  _id: string;
  connectionString: string;
  title: string;
  message: string;
  time: string;
};
export async function POST(request: Request) {
  const message: Message = await request.json();

  console.log("Message Recieved: ", message);
  // const messageRtr: Message =
  try {
    await Message.create(message);
    return Response.json({ status: "success" });
  } catch (error) {
    console.error("Error saving message: ", error);
    return Response.json(
      { status: "error", error: "Failed to save message" },
      { status: 500 },
    );
  }

  // const io = getIO();
  // io.emit("message", { ...message, _id: messageRtr._id });
}
