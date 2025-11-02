"use client";

import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { TrashIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [isDeletingChat, setIsDeletingChat] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const authToken = useAuthStore((s) => s.token);

  const {
    chats,
    fetchChatHistory,
    setCurrentChatId,
    startNewChat,
    deleteChat: deleteChatAction,
  } = useChatStore();

  const hasInitialFetch = useRef(false);

  // Fetch chat history on mount
  useEffect(() => {
    if (authToken && !hasInitialFetch.current) {
      hasInitialFetch.current = true;
      fetchChatHistory({ authToken });
    }
  }, [authToken, fetchChatHistory]);

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

  function handleChatClick(chatId: string) {
    router.push(`/dashboard/chat/${chatId}`);
  }

  async function handleDeleteChat(chatId: string) {
    setChatToDelete(chatId);
    setDeleteModalOpen(true);
  }

  async function confirmDeleteChat() {
    if (!chatToDelete || !authToken) return;
    setIsDeletingChat(true);
    try {
      await deleteChatAction({ chatId: chatToDelete, authToken });
      setDeleteModalOpen(false);
      setChatToDelete(null);

      // If the deleted chat is currently open, redirect to new chat
      if (pathname.includes(`/chat/${chatToDelete}`)) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setIsDeletingChat(false);
    }
  }
  function Nav({ onNav }: { onNav?: () => void } = {}) {
    return (
      <nav className="flex flex-col h-full w-64 md:border-r md:border-default-200 p-4">
        <div className="mb-6 flex items-center gap-2">
          <Avatar size="md" name={user?.fullName || "User"} />
          <span className="font-semibold text-lg truncate">Volvox</span>
        </div>
        <div className="mb-4">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);

            return (
              <Button
                key={link.href}
                className={`w-full justify-start rounded-lg px-3 py-2 font-medium transition-colors
                  ${
                    isActive
                      ? "bg-secondary/10 text-primary dark:text-primary-foreground"
                      : "hover:bg-default-200/60 dark:hover:bg-default-300/10"
                  }
                `}
                variant={isActive ? "solid" : "light"}
                color={isActive ? "primary" : "default"}
                onPress={() => {
                  if (link.href === "/dashboard") {
                    startNewChat();
                  }
                  router.push(link.href);
                  if (onNav) onNav();
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </div>
        <Divider className="my-2" />
        <div className="sticky top-0 bg-white dark:bg-default-100 z-10 mb-2">
          <div className="text-xs font-semibold text-default-400">
            Recent Chats
          </div>
        </div>
        <div className="flex-1 overflow-y-auto mb-4 scrollbar-hide">
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div className="flex flex-col gap-1">
            {chats.length === 0 ? (
              <div className="text-xs text-default-400 px-2 py-1">
                No chat history yet
              </div>
            ) : (
              chats.map((chat) => {
                const isChatActive = pathname.includes(`/chat/${chat.chat_id}`);
                return (
                  <div
                    key={chat.chat_id}
                    className={`group flex items-center gap-1 rounded-lg transition-colors ${
                      isChatActive ? "bg-secondary/10" : "hover:bg-default-100"
                    }`}
                  >
                    <Button
                      className={`flex-1 justify-start truncate text-sm px-2 py-1 font-normal ${
                        isChatActive
                          ? "text-primary dark:text-primary-foreground font-medium"
                          : ""
                      }`}
                      variant="light"
                      color={isChatActive ? "primary" : "default"}
                      size="sm"
                      onPress={() => {
                        handleChatClick(chat.chat_id);
                        if (onNav) onNav();
                      }}
                    >
                      {chat.chat_title}
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onPress={() => handleDeleteChat(chat.chat_id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })
            )}
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
                <ChevronDownIcon className="w-4 h-4 text-default-500" />
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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with hamburger */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-default-100 border-b border-default-200">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            aria-label="Open navigation"
            onPress={() => setMobileOpen(true)}
          >
            <svg
              className="w-5 h-5"
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
          <h1 className="text-lg font-semibold">
            {pathname === "/dashboard"
              ? "Chat"
              : pathname.includes("/research")
                ? "Research"
                : pathname.includes("/chat/")
                  ? "Chat"
                  : "Dashboard"}
          </h1>
        </div>
        {/* Page content */}
        <div className="flex-1 overflow-y-auto md:mt-4">{children}</div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Delete Chat</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => {
                setDeleteModalOpen(false);
                setChatToDelete(null);
              }}
              disabled={isDeletingChat}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={confirmDeleteChat}
              isLoading={isDeletingChat}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
