import { AllowedClients } from "@/lib/db";

export async function GET(request: Request) {
  const userName = request.url.split("?userName=")[1].split("&")[0];
  const connectionString = request.url.split("&connectionString=")[1];

  const allowedClients = await AllowedClients.find({ connectionString });

  if (allowedClients.includes(userName)) {
    console.log(`User already exists`);
    return Response.json({
      status: "error",
      error: "User already exists",
    });
  }

  return Response.json({
    status: "success",
    message: "User name is available",
  });
}
