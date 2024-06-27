import NextAuth from "next-auth/next";
import { authOptios } from "./options";

const handler = NextAuth(authOptios);

export { handler as GET, handler as POST };
