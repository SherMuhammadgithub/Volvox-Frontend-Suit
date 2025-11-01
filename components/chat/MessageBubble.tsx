"use client";

import { ChatMessage } from "@/api/chat";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: ChatMessage;
  userEmail?: string;
}

export function MessageBubble({ message, userEmail }: MessageBubbleProps) {
  return (
    <div className="space-y-4">
      {/* User Question */}
      <div className="flex items-start gap-3 justify-end">
        <Card className="max-w-[80%] bg-primary-100 dark:bg-primary-900/20">
          <CardBody className="p-3">
            <p className="text-sm">{message.question}</p>
          </CardBody>
        </Card>
        <Avatar size="sm" name={userEmail || "U"} className="flex-shrink-0" />
      </div>

      {/* AI Response */}
      <div className="flex items-start gap-3">
        <Avatar
          size="sm"
          src="/images/ai.png"
          alt="AI Assistant"
          className="flex-shrink-0"
        />
        <Card className="max-w-[80%] bg-default-100">
          <CardBody className="p-3">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{message.response}</ReactMarkdown>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
