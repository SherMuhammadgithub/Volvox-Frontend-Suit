import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import { Tooltip } from "@heroui/tooltip";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
// import { Navbar } from "@/components/navbar";
import { ThemeSwitch } from "@/components/theme-switch";
import { AuthInitializer } from "@/components/auth-initializer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <AuthInitializer />
          <div className="relative flex flex-col h-screen">
            {/* No Navbar, but add floating theme switch */}
            <main className="container flex-grow">{children}</main>
            {/* Floating theme switch button */}
            <div className="fixed bottom-4 md:bottom-6 right-6 z-50">
              <Tooltip
                content="Toggle theme"
                placement="top-end"
                className="z-50"
              >
                <span>
                  <ThemeSwitch iconSize={30} />
                </span>
              </Tooltip>
            </div>
            {/* Centered footer */}
            <footer className="absolute left-0 right-0 bottom-0 flex justify-center items-center pb-2 pointer-events-none select-none">
              <span className="text-xs text-default-500 font-semibold">
                Powered by Team Terabytes
              </span>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
