import mongoose, { connection } from "mongoose";

type ConnectionObj = {
  isConnected?: number;
};

const connnection: ConnectionObj = {};

export const dbConnect = async (): Promise<void> => {
  if (connnection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(
      "mongodb+srv://nextjs13:nextjs13@inotebook.ukflwtj.mongodb.net/chaiwithcode"
    );

    connnection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
};
