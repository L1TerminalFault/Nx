import { Message } from "@/lib/db";

export async function POST(request: Request) {
  const message = request.json();
  await Message.create(message);
  return Response.json({ status: "success" });
}
