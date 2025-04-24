import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import { getServerSession } from "next-auth";

export const config = {
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

export const { auth, handlers: { GET, POST }, signIn, signOut } = NextAuth(config);

// Export a method to get the session on the server side
export const getSession = () => getServerSession(config); 