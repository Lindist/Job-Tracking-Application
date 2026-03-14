import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

// Allowlist: Production URL + Vercel preview URLs ทุก pattern ของโปรเจคนี้
const allowedOrigins = [
  "https://job-tracking-application-khaki.vercel.app", // Production URL
];

// Regex สำหรับ Vercel preview deployment URLs (job-tracking-application-*.vercel.app)
const vercelPreviewPattern = /^https:\/\/job-tracking-application-[a-z0-9-]+-[a-z0-9-]+-projects\.vercel\.app$/;

function getAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;
  if (allowedOrigins.includes(origin)) return origin;
  if (vercelPreviewPattern.test(origin)) return origin;
  return null;
}

export default async function proxy(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigin = getAllowedOrigin(origin);

  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    ...(allowedOrigin ? { "Access-Control-Allow-Origin": allowedOrigin } : {}),
  };

  // จัดการ CORS preflight request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  const session = await getSession();

  const isSignInPage = request.nextUrl.pathname.startsWith("/sign-in");
  const isSignUpPage = request.nextUrl.pathname.startsWith("/sign-up");

  if ((isSignInPage || isSignUpPage) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();

  // เพิ่ม CORS headers ให้ทุก /api response
  if (request.nextUrl.pathname.startsWith("/api") && allowedOrigin) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}
