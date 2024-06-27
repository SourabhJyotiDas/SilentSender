import { dbConnect } from "@/lib/database";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerification } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await req.json();

    const isUserExist = await UserModel.findOne({ username, isVerified: true });

    if (isUserExist) {
      return Response.json({
        success: false,
        message: "Username is Already Taken",
      });
    }

    const user = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

    if (user) {
      // if User is Present but he is Verified/UnVerified then --->
      if (user.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.verifyCode = verifyCode;
        user.verifyCodeExpire = new Date(Date.now() + 3600000);
        await user.save();
      }
    } else {
      // if Everthing is ok with the User then --->

      const hashedPassword = await bcrypt.hash(password, 10);
      const veriyCodeExpiryDate = new Date();
      veriyCodeExpiryDate.setHours(veriyCodeExpiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpire: veriyCodeExpiryDate,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
        joinedAt: Date.now(),
      });

      await newUser.save();
    }

    //  send verification Email
    const emailResponse = await sendVerification(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "Failed during sending email",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Registerd successfully, Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error,
      },
      { status: 500 }
    );
  }
}
