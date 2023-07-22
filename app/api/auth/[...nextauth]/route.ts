import NextAuth from "next-auth/next";
import githubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";

import { AuthOptions, DefaultUser, User } from "next-auth";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
interface Userd extends DefaultUser {
  username: string;
}
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });
        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials?.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return user;
      },
    }),
    githubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async jwt({ account, token, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.username = (user as Userd).username;
        console.log({ user });
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
