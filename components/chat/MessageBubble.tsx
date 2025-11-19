"use client";

import { ChatMessage } from "@/api/chat";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

interface MessageBubbleProps {
  message: ChatMessage;
  userEmail?: string;
  typewriter?: boolean;
}

export function MessageBubble({ message, userEmail, typewriter }: MessageBubbleProps) {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    if (!typewriter) {
      setDisplayedText(message.response || "");
      return;
    }
    let i = 0;
    setDisplayedText("");
    if (!message.response) return;
    const interval = setInterval(() => {
      if (i < message.response.length) {
        setDisplayedText((prev) => prev + message.response.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        // Mark message as not new so typewriter doesn't repeat
        if (message.isNew) {
          message.isNew = false;
        }
      }
    }, 18); // ~55 chars/sec
    return () => clearInterval(interval);
  }, [message.response, typewriter]);

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

      {/* AI Response with typewriter effect */}
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
              <ReactMarkdown>{displayedText}</ReactMarkdown>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
