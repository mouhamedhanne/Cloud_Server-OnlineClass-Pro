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

      return true;
    },
  },
});

export const config = {
  matcher: ["/levels/:path*"],
};
