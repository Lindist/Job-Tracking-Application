import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

const allowedOrigin =
  "https://job-tracking-application-c3zo53f5e-four181049-8397s-projects.vercel.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export default async function proxy(request: NextRequest) {
  // จัดการ CORS preflight request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  const session = await getSession();

  const isSignInPage = request.nextUrl.pathname.startsWith("/sign-in");
  const isSignUpPage = request.nextUrl.pathname.startsWith("/sign-up");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  if ((isSignInPage || isSignUpPage) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // if (isDashboardPage && !session?.user) {
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  // }

  const response = NextResponse.next();

  // เพิ่ม CORS headers ให้ทุก response ที่ผ่าน proxy
  if (request.nextUrl.pathname.startsWith("/api")) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}