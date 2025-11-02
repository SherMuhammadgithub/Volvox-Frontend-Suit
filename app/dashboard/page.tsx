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

  const handleSendMessage = async (message: string, researchId?: string) => {
    if (!authToken) return;

    try {
      const response = await askQuestion({
        question: message,
        chatId: currentChat?.chat_id, // Pass existing chat_id if available
        researchId, // Pass selected research_id
        authToken,
      });

      // Update URL without navigation to avoid skeleton loading
      // Only update URL on first message (when currentChat didn't have a chat_id)
      if (response.chat_id && !currentChat?.chat_id) {
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
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
      {/* Chat Header */}
      <Card className="mx-2 sm:mx-4 mt-2 sm:mt-4 rounded-t-lg border-b border-default-200">
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-bold text-default-900">
              Chat
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-default-600">New Chat</p>
          </div>
        </CardHeader>
      </Card>

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
