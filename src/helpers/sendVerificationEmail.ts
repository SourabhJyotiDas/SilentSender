import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerficationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerification(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username, verifyCode }),
    });
    return { success: true, message: "Send verification email successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send verification email" };
  }
}
