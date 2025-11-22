import mongoose from "mongoose";

const getTime = (): number => {
  const now = new Date.now();
  return now;
};

const messageSchema = new mongoose.Schema({
  userId: String,
  message: String,
  time: { type: String, default: getTime() },
});

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

await (async () => {
  await mongoose.connect(process.env.MONGODB_URI || "");
  console.log("MongoDB connected");
})();

export const addMessage = async ({
  userId,
  message,
  time,
}: {
  userId: string;
  message: string;
  time: string;
}) => {
  const messageObj = new Message({ userId, message, time });
  try {
    await messageObj.save();
  } catch (error) {
    return `DB Error: Unable to add message: ${error}`;
  }
};
