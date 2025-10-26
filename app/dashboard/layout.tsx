"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const navLinks = [
    { label: "New Chat", href: "/dashboard" },
    { label: "Manage Research Work", href: "/dashboard/research" },
    { label: "Settings", href: "/dashboard/settings" },
  ];
  const dummyChats = [
    "Welcome to Volvox!",
    "Your recent activity",
    "Project updates",
    "Team chat",
  ];

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  function Nav({ onNav }: { onNav?: () => void } = {}) {
    return (
      <nav className="flex flex-col h-full w-64 md:border-r md:border-default-200 p-4">
        <div className="mb-6 flex items-center gap-2">
          <Avatar size="md" name={user?.fullName || "User"} />
          <span className="font-semibold text-lg truncate">Volvox</span>
        </div>
        <div className="mb-4">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              className={`w-full justify-start rounded-lg px-3 py-2 font-medium transition-colors
                ${
                  pathname === link.href
                    ? "bg-secondary/10 text-primary dark:text-primary-foreground"
                    : "hover:bg-default-200/60 dark:hover:bg-default-300/10"
                }
              `}
              variant={pathname === link.href ? "solid" : "light"}
              color={pathname === link.href ? "primary" : "default"}
              onPress={() => {
                router.push(link.href);
                if (onNav) onNav();
              }}
            >
              {link.label}
            </Button>
          ))}
        </div>
        <Divider className="my-2" />
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="text-xs font-semibold text-default-400 mb-2">
            Recents
          </div>
          <div className="flex flex-col gap-1">
            {dummyChats.map((chat, idx) => (
              <Button
                key={idx}
                className="w-full justify-start truncate text-sm px-2 py-1 font-normal transition-colors hover:bg-default-200/60 dark:hover:bg-default-300/10"
                variant="light"
                color="default"
                size="sm"
                // onPress={() => ...} // Add handler if you want to open chat
              >
                {chat}
              </Button>
            ))}
          </div>
        </div>
        <Divider className="my-2" />
        <div className="flex items-center gap-2 mt-auto">
          <Popover placement="top-end">
            <PopoverTrigger>
              <Button
                variant="light"
                className="flex items-center gap-2 px-2 py-1 rounded-lg"
                aria-label="Account menu"
              >
                <Avatar size="sm" name={user?.fullName || "User"} />
                <span className="truncate max-w-[120px] text-sm font-medium">
                  {user?.email || "User"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[220px] p-0">
              <div className="px-4 pt-4 pb-2 text-xs text-default-400">
                {user?.email || "User"}
              </div>
              <Divider className="my-1" />
              <Button
                className="w-full justify-start px-4 py-2 rounded-none font-normal"
                variant="light"
                color="default"
                onPress={() => router.push("/dashboard/settings")}
              >
                Settings
              </Button>
              <Button
                className="w-full justify-start px-4 py-2 rounded-none font-normal"
                variant="light"
                color="default"
                onPress={() => router.push("/dashboard/profile")}
              >
                Profile
              </Button>
              <Divider className="my-1" />
              <Button
                className="w-full justify-start px-4 py-2 rounded-none font-normal text-danger"
                variant="light"
                color="danger"
                onPress={handleLogout}
              >
                Log out
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full flex-col w-64 bg-white dark:bg-default-100 border-r border-default-200">
        <Nav />
      </div>
      {/* Mobile sidebar using HeroUI Drawer */}
      <div className="md:hidden">
        <Button
          className="fixed top-3 left-4 z-50"
          isIconOnly
          variant="flat"
          color="primary"
          aria-label="Open navigation"
          onPress={() => setMobileOpen(true)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
        <Drawer
          isOpen={mobileOpen}
          onOpenChange={setMobileOpen}
          placement="left"
          size="full"
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">
                  Navigation
                </DrawerHeader>
                <DrawerBody className="p-0">
                  <Nav onNav={() => setMobileOpen(false)} />
                </DrawerBody>
                {/* No DrawerFooter/Close button at the bottom */}
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>
      {/* Main content */}
      <main className="flex-1  overflow-y-auto mt-14">{children}</main>
    </div>
  );
}
