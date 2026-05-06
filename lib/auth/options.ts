import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcryptjs";

import clientPromise from "@/lib/db/mongoClient";
import { dbConnect } from "@/lib/db/connect";
import { User, type UserRole } from "@/lib/models";

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null;

    await dbConnect();

    const user = await User.findOne({ email: credentials.email.toLowerCase() })
      .select("+passwordHash")
      .lean<{
        _id: { toString(): string };
        email: string;
        name?: string;
        passwordHash?: string;
        role: UserRole;
        image?: string | null;
      } | null>();

    if (!user || !user.passwordHash) return null;

    const ok = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!ok) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name ?? user.email,
      image: user.image ?? null,
      role: user.role,
    };
  },
});

const providers: NextAuthOptions["providers"] = [credentialsProvider];

const useEmailProvider = !!(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);

if (useEmailProvider) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
      maxAge: 60 * 60, // 1h
    }),
  );
}

export const authOptions: NextAuthOptions = {
  // Adapter is required for EmailProvider's verification tokens. Mounting it
  // unconditionally is safe — Credentials still uses JWT-only sessions.
  adapter: clientPromise ? MongoDBAdapter(clientPromise) : undefined,
  providers,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 days
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
    verifyRequest: "/admin/login?verify=1",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Magic-link sign-in: auto-attach role from DB if user already exists,
      // otherwise reject (we don't open up self-signup for the admin panel).
      if (account?.provider === "email") {
        await dbConnect();
        const existing = await User.findOne({ email: user.email?.toLowerCase() }).lean<{
          role: UserRole;
        } | null>();
        if (!existing) return false;
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      // First sign-in: copy role onto the token
      if (user && "role" in user) {
        token.role = (user as { role?: UserRole }).role ?? "viewer";
      }

      // Magic-link path: user object only has email/name; pull role from DB
      if (!token.role && token.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email }).lean<{
          role: UserRole;
        } | null>();
        token.role = dbUser?.role ?? "viewer";
      }

      // Allow client to refresh role via update() — useful after admin role change
      if (trigger === "update" && token.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email }).lean<{
          role: UserRole;
        } | null>();
        if (dbUser) token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? "";
        session.user.role = (token.role as UserRole) ?? "viewer";
      }
      return session;
    },
  },
};

export const ADMIN_ROLES: UserRole[] = ["admin", "editor"];

export function isAdminRole(role: UserRole | undefined): role is "admin" | "editor" {
  return !!role && ADMIN_ROLES.includes(role);
}
