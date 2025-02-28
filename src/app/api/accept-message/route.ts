import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/database";
import UserModel from "@/models/User";

export async function POST(request: Request) {
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

  const userId = user?._id;

  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed during update user accept messages",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Messages acceptance status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed during update user accept messages",
      },
      { status: 500 }
    );
  }
}

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

  const userId = user?._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    return Response.json(
      { success: false, isAcceptingMessage: foundUser.isAcceptingMessage },
      { status: 401 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to see user messsage status" },
      { status: 500 }
    );
  }
}
