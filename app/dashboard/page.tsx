"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@heroui/card";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  const { currentChat, loading, askQuestion, startNewChat } = useChatStore();

  const authToken = useAuthStore((s) => s.token);

  // Zustand hydration detection
  useEffect(() => {
    setHasHydrated(useAuthStore.persist?.hasHydrated?.() ?? true);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated && !user) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, user, hasHydrated, router]);

  // Start new chat on mount
  useEffect(() => {
    startNewChat();
  }, [startNewChat]);

  if (!hasHydrated || (!isAuthenticated && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-default-500">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (
    message: string,
    researchId?: string,
    web_search?: boolean
  ) => {
    if (!authToken) return;

    try {
      const response = await askQuestion({
        question: message,
        chatId: currentChat?.chat_id, // Pass existing chat_id if available
        researchId, // Pass selected research_id
        web_search,
        authToken,
      });

      // Update URL without navigation to avoid skeleton loading
      // Only update URL on first message (when currentChat didn't have a chat_id)
      if (response && response.chat_id && !currentChat?.chat_id) {
        window.history.replaceState(
          null,
          "",
          `/dashboard/chat/${response.chat_id}`
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[78vh] md:h-[88vh] max-w-7xl mx-auto w-full">
      {/* Chat Messages */}
      <ChatMessages
        messages={currentChat?.messages || []}
        userEmail={user?.fullName}
        loading={loading}
      />

      {/* Chat Input */}
      <div className="px-2 sm:px-4 pb-2 sm:pb-4">
        <ChatInput onSend={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
}
