"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "@heroui/skeleton";
import { Card, CardHeader } from "@heroui/card";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId as string;

  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  const { currentChat, loading, loadingChat, askQuestion, fetchChatById } =
    useChatStore();

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

  // Load chat when chatId or authToken changes
  useEffect(() => {
    if (chatId && authToken) {
      // Only fetch if we don't already have this chat loaded
      if (!currentChat || currentChat.chat_id !== chatId) {
        fetchChatById({ chatId, authToken });
      }
    }
  }, [chatId, authToken]);

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
      await askQuestion({
        question: message,
        chatId: chatId,
        researchId, // Pass selected research_id
        authToken,
      });
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
            {loadingChat ? (
              <Skeleton className="h-5 w-40 rounded-lg" />
            ) : (
              <p className="text-sm font-medium text-default-600 truncate max-w-[200px]">
                {currentChat?.chat_title || "Chat"}
              </p>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      {loadingChat ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 mx-2 sm:mx-4">
          {/* Skeleton loading for messages */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              {/* User message skeleton */}
              <div className="flex justify-end">
                <div className="max-w-[70%] space-y-2">
                  <Skeleton className="h-4 w-48 rounded-lg" />
                  <Skeleton className="h-4 w-32 rounded-lg" />
                </div>
              </div>
              {/* AI response skeleton */}
              <div className="flex justify-start">
                <div className="max-w-[70%] space-y-2">
                  <Skeleton className="h-4 w-64 rounded-lg" />
                  <Skeleton className="h-4 w-56 rounded-lg" />
                  <Skeleton className="h-4 w-40 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ChatMessages
          messages={currentChat?.messages || []}
          userEmail={user?.fullName}
          loading={loading}
        />
      )}

      {/* Chat Input */}
      <div className="px-2 sm:px-4 pb-2 sm:pb-4">
        <ChatInput
          onSend={handleSendMessage}
          disabled={loading || loadingChat}
        />
      </div>
    </div>
  );
}
