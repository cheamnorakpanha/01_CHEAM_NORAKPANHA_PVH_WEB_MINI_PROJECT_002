import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginService } from "../service/auth.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const response = await loginService(credentials);
        return response;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      const data = { ...token, ...user };
      return data;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});

export const { GET, POST } = handlers;
