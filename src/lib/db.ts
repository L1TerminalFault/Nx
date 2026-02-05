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

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

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
