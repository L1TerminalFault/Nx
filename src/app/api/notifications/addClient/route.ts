import { addClient } from "@/lib/db";

type NewUsers = {
  connectionString: string;
  allowedClients: string[];
};

export async function POST(request: Request) {
  try {
    const newUsers: NewUsers = await request.json();

    const res = await addClient(newUsers);
    if (res) return Response.json({ status: "error", message: res });
  } catch (error) {
    return Response.json({ status: "error", message: error });
  }
}
