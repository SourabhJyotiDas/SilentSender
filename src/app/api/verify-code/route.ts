import { dbConnect } from "@/lib/database";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, otp } = await req.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not Found",
      });
    }

    const isCodeValid = user.verifyCode === otp;
    const isCodeExpire = new Date(user.verifyCodeExpire) > new Date();

    if (!isCodeValid) {
      return Response.json(
        {
          success: true,
          message: "Wrong otp",
        },
        { status: 400 }
      );
    }
    if (!isCodeExpire) {
      return Response.json(
        {
          success: true,
          message: "Your Code has Expired, Please try again",
        },
        { status: 400 }
      );
    }

    if (isCodeValid && isCodeExpire) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User Verified Successfully",
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Please verify again",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Errpr in verify Code CompOnents",
      },
      { status: 500 }
    );
  }
}
