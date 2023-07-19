import NextAuth from "next-auth/next";
import githubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";

import { signJwtAccessToken } from "@/lib/jwt";
import { RequestInternal, User } from "next-auth";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Promise<User | null> {
        const { username } = req.body || {};
        const user = await prisma.user.findFirst({
          where: { email: username },
        });
        if (!user) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials?.password as string,
          user.password
        );
        if (!isPasswordCorrect) {
          return null;
        }

        const { password, ...userWithoutPass } = user;
        const accessToken = signJwtAccessToken(userWithoutPass);
        const result = { ...userWithoutPass, accessToken };
        return result as unknown as User;
      },
    }),
    githubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
