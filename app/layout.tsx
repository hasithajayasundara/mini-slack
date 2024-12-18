import type { Metadata } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import "./globals.css";
import { ConvexClientProvider } from "../components/convex-client-provider";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "mini-slack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body>
          <ConvexClientProvider>
            <Toaster />
            <Modals />
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
