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
        console.log("Attempting login with credentials:", credentials.email);
        const response = await loginService(credentials);
        console.log(
          "Login service response:",
          JSON.stringify(response, null, 2),
        );

        if (
          response &&
          (response.status === "200 OK" ||
            response.status === 200 ||
            response.status === "200")
        ) {
          console.log("Login success. Payload:", response.payload);
          return response.payload;
        }
        console.warn("Login failed or unexpected status:", response?.status);
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
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
