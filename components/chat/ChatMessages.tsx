"use client";

import { useEffect, useRef } from "react";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { MessageBubble } from "./MessageBubble";
import { ChatMessage } from "@/api/chat";
import { Spinner } from "@heroui/spinner";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/solid";

interface ChatMessagesProps {
  messages: ChatMessage[];
  userEmail?: string;
  loading?: boolean;
}

export function ChatMessages({
  messages,
  userEmail,
  loading = false,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className=" max-w-md">
          <div className="flex justify-start items-center gap-2">
            <div className="flex">
              <SparklesIcon className="w-12 h-12 text-default-400 dark:text-default-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Start a New Chat</h2>
          </div>
          <p className="text-default-600 dark:text-default-400 mb-8">
            Ask me anything! I'm powered by AI and ready to help.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <SparklesIcon className="w-5 h-5 text-default-400 dark:text-default-500 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-semibold text-default-700 dark:text-default-300">
                  Ask Questions
                </p>
                <p className="text-xs text-default-500 dark:text-default-400">
                  Get instant answers to your questions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DocumentTextIcon className="w-5 h-5 text-default-400 dark:text-default-500 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-semibold text-default-700 dark:text-default-300">
                  Attach Research Work
                </p>
                <p className="text-xs text-default-500 dark:text-default-400">
                  Include research works for better answers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} userEmail={userEmail} />
      ))}
      {loading && (
        <div className="flex items-start gap-3">
          <Avatar
            size="sm"
            src="/images/ai.png"
            alt="AI Assistant"
            className="flex-shrink-0"
          />
          <Card className="bg-default-100 border border-default-200 dark:bg-default-200">
            <CardBody className="flex flex-row items-center gap-2 px-4 py-3">
              <Spinner size="sm" color="primary" />
              <span className="text-sm text-default-600 dark:text-default-500">
                Thinking...
              </span>
            </CardBody>
          </Card>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
