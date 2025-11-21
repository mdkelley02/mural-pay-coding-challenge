import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// You must export GET and POST as named exports
export { handler as GET, handler as POST };
