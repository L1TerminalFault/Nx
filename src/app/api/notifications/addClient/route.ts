import { addClient, AllowedClients } from "@/lib/db";

type NewUser = {
  connectionString: string;
  userName: string;
};

export async function POST(request: Request) {
  try {
    const { connectionString, userName }: NewUser = await request.json();

    const allowedClients = await AllowedClients.find({ connectionString });
    const total = allowedClients[0].allowedClients.push(userName);

    const res = await addClient(total);

    if (res) return Response.json({ status: "error", message: res });
  } catch (error) {
    return Response.json({ status: "error", message: error });
  }
}
