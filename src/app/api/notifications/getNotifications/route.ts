import { Message } from "@/lib/db";

export async function GET() {
  const messages = Message.find();

  return Response.json({ status: "success", messages });
}
