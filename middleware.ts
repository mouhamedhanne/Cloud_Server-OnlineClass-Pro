import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const path = req.nextUrl.pathname;

      if (path.startsWith("/levels")) {
        if (path === "/levels" || path.startsWith("/levels/")) {
          return token?.role === "admin";
        }
      }
      if (req.nextUrl.pathname.startsWith("/"))
        return token?.role === "admin";
      
      return !!token;
    },
  },
});
export const config = {
  matcher: [
    "/admin/:path*",
    "/:path*",
  ],
};
