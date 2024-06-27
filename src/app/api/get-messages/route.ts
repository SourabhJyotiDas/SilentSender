import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/database";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!session || session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user?._id);
  
  try {
    // -----------> My Code
    // const messages = await User.findById(userId).populate(
    //    "messages"
    //  );

    const user = await UserModel.aggregate([
      { $match: { id: userId } }, // <---pipeline
      { $unwind: "$messages" }, //  <----- unwind those arrays // works only with arrays
      { $sort: { "messages.createdAt": -1 } }, //sorting by time
      { $group: { _id: "$_id", allMessages: { $push: "messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
