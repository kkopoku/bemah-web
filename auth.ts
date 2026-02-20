import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import { ZodError } from "zod";
import { backendUrl } from "./constants/env";
import { signInSchema } from "./lib/zod";

declare module "next-auth" {
  interface User {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        try {
          let user = null;

          if (!credentials) {
            throw new Error("Please provide all the required details");
          }

          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const tokenResponse = await axios.post(
            `${backendUrl}/api/v1/app/auth/token`,
            {
              clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
              clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (tokenResponse.data.status !== "success") {
            throw new Error(
              tokenResponse.data.message || "Failed to generate client token",
            );
          }

          const clientToken = tokenResponse.data.data.accessToken;

          const loginResponse = await axios.post(
            `${backendUrl}/api/v1/app/auth/login`,
            {
              email,
              password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${clientToken}`,
              },
            },
          );

          if (loginResponse.data.status !== "success") {
            throw new Error(loginResponse.data.message || "Login failed");
          }

          const { accessToken } = loginResponse.data.data;

          const userResponse = await axios.get(
            `${backendUrl}/api/v1/app/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (userResponse.data.status !== "success") {
            throw new Error(
              userResponse.data.message || "Failed to fetch user details",
            );
          }

          const userData = userResponse.data.data;

          user = {
            id: userData.id,
            name:
              userData.businessAdmin?.name ||
              userData.subscriber?.name ||
              userData.email,
            email: userData.email,
            accessToken: accessToken,
          };

          return user;
        } catch (error) {
          console.error("Authorization error:", error);

          if (error instanceof ZodError) {
            throw new Error("Invalid credentials format.");
          }

          if (axios.isAxiosError(error)) {
            throw new Error(
              error.response?.data?.message || "Authentication failed.",
            );
          }

          throw new Error("Unexpected error during authentication.");
        }
      },
    }),
  ],

  pages: {
    signIn: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hour
  },

  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
});
