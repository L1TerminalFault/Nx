import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    connectionString: String,
    title: String,
    message: String,
    time: String,
  },
  { collection: "notifications" },
);

const allowedClientsSchema = new mongoose.Schema({
  connectionString: String,
  allowedClients: [String],
});

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export const AllowedClients =
  mongoose.models.AllowedClients ||
  mongoose.model("AllowedClients", allowedClientsSchema);

await (async () => {
  await mongoose.connect(process.env.MONGODB_URI || "");
  console.log("MongoDB connected");
})();

export const addMessage = async ({
  connectionString,
  title,
  message,
  time,
}: {
  connectionString: string;
  title: string;
  message: string;
  time: string;
}) => {
  const messageObj = new Message({ connectionString, title, message, time });
  try {
    await messageObj.save();
  } catch (error) {
    return `DB Error: Unable to add message: ${error}`;
  }
};

export const addClient = async ({
  connectionString,
  allowedClients,
}: {
  connectionString: string;
  allowedClients: string[];
}) => {
  try {
    await AllowedClients.findOneAndUpdate(
      { connectionString },
      { $push: { allowedClients } },
    );
  } catch (error) {
    return `DB Error: Unable to update entry: ${error}`;
  }
};
