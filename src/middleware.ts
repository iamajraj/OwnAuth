import { ownAuthMiddleware } from "@/lib/own-auth/middleware";
import { NextResponse } from "next/server";

const protectedRoutes = ["/"];
const authRoutes = ["/login"];

export default ownAuthMiddleware((req, user) => {
  const pathname = new URL(req.url).pathname;

  console.log("AUTH: ", user);

  if (!user && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (user && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  } else {
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
