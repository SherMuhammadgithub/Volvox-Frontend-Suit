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
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { PWAInstallModal } from "@/components/pwa-install-modal";

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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#38975b" />
      </head>
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ServiceWorkerRegister />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {/* <AuthInitializer /> */}
          <div className="relative flex flex-col h-screen">
            {/* PWA Install Modal */}
            <PWAInstallModal />
            {/* No Navbar, but add floating theme switch */}
            <main>{children}</main>
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
          </div>
        </Providers>
      </body>
    </html>
  );
}
