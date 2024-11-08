import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "Cloud Server OnlineClass Pro",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
