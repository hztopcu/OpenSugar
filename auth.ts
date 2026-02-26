import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Ghost Mode: single app credential from env (APP_USER, APP_PASSWORD).
 * No users table; no signup. All data scoped by this user id.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || "opensugar-dev-secret",
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // .env'deki değerlerde bazen sondaki boşluk/satır sonu olur; trim ediyoruz
        const appUser = process.env.APP_USER?.trim();
        const appPassword = process.env.APP_PASSWORD?.trim();
        if (!appUser || !appPassword) return null;
        const username = String(credentials?.username ?? "").trim();
        const password = String(credentials?.password ?? "").trim();
        // Kullanıcı adı büyük/küçük harf duyarsız, şifre duyarlı
        if (username.toLowerCase() !== appUser.toLowerCase() || password !== appPassword) return null;
        return { id: appUser, name: appUser };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.sub ?? "";
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
});

declare module "next-auth" {
  interface Session {
    user: { id: string; name?: string | null };
  }
}
