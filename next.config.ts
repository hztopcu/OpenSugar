import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Middleware (middleware.ts) must only import NextResponse from "next/server"; no auth/db/path to avoid __dirname on Edge. */
};

export default nextConfig;
