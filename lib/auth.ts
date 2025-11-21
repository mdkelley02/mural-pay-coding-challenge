import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          // 2. CHECK EXISTING USER
          const existingUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (existingUser) {
            console.log("Found existing user:", existingUser.id);
            return existingUser;
          }

          // 3. CREATE GUEST USER
          console.log("Creating new guest user for:", credentials.email);
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              role:
                credentials.email === "admin@merchantinc.com"
                  ? "ADMIN"
                  : "USER",
              // ensure your schema.prisma doesn't make 'name' or 'password' required!
            },
          });

          console.log("Created new user:", newUser.id);
          return newUser;
        } catch (error) {
          // 4. CATCH DB ERRORS
          console.error("AUTHORIZE ERROR:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export async function getUserIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return null;
  }

  return session.user.id;
}
