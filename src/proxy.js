import { auth } from "@/libs/auth";

export const proxy = auth((request) => {
  if (!request.auth) {
    return Response.redirect(new URL("/login", request.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/products", "/"],
};
