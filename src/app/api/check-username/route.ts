import { dbConnect } from "@/lib/database";
import UserModel from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUp";
import { existsSync } from "fs";

const UserNameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(req: Request) {
  // url : "http://localhost:3000/api/check-username?username="Sourabh99"

  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const queryParam = {
      username: searchParams.get("username"),
    };
    //  validate with Zod
    const result = UserNameQuerySchema.safeParse(queryParam);

    //  console.log(result);   Let me check later

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message: usernameErrors,
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const exisitingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exisitingUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 400 }
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
