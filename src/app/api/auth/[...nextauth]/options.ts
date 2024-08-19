import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/database";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier.email },
              { username: credentials.identifier.username },
            ],
          });

          if (!user) {
            throw new Error("No User found");
          }

          if (!user.isVerified) {
            throw new Error("Pleasse verify your account first");
          }
          const isMatchPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isMatchPassword) {
            throw new Error("Incorrect Password");
          }

          return user;
        } catch (error: any) {
          return null;
        }
      },
    }),
  ],


  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },


  pages: {
    signIn: "/sign-up",
    //  signOut: "/auth/signout",
    //  error: "/auth/error", // Error code passed in query string as ?error=
    //  verifyRequest: "/auth/verify-request", // (used for check email message)
    //  newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },



  session: {
    strategy: "jwt",
  },


  secret: process.env.NEXTAUTHSECRET,
};
