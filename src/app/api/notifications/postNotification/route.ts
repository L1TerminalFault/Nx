import { Message } from "@/lib/db";
// import { NextResponse as Response } from "next/server";

// import { getIO } from "@/lib/socket";
//
const MAX_DOCS = 15;

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

    const entries_to_delete = await Message.find({
      connectionString: message.connectionString,
    })
      .sort({ time: -1 })
      .skip(MAX_DOCS)
      .select("_id");

    if (entries_to_delete.length > 0) {
      const ids_to_delete = entries_to_delete.map((entry) => entry._id);
      Message.deleteMany({ _id: { $in: ids_to_delete } }).exec();
    }

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
