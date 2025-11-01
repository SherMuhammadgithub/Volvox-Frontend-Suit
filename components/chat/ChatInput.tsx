"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ChatInputProps {
  onSend: (message: string, file?: File) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && !file) return;
    onSend(message, file || undefined);
    setMessage("");
    setFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {file && (
        <div className="flex items-center gap-2 p-2 bg-default-100 rounded-lg border border-default-200">
          <PaperClipIcon className="w-4 h-4 text-default-500 flex-shrink-0" />
          <span className="text-sm text-default-700 flex-1 truncate">
            {file.name}
          </span>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={handleRemoveFile}
            className="flex-shrink-0"
          >
            <XMarkIcon className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 bg-default-100/50 dark:bg-default-100/40 rounded-2xl px-4 py-4 border border-default-300/40">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          disabled={disabled}
          minRows={3}
          maxRows={5}
          classNames={{
            base: "w-full",
            input:
              "text-default-700 placeholder:text-default-400 bg-transparent text-sm font-normal resize-none p-4",
            innerWrapper: "bg-transparent",
            inputWrapper: "bg-transparent shadow-none p-0 h-auto",
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />

            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="text-default-500 hover:text-default-700 transition-colors"
            >
              <PaperClipIcon className="w-5 h-5" />
            </Button>
            <span className="text-xs text-default-500">Add files</span>
          </div>

          <div className="flex items-center gap-2">
            <Chip size="sm" variant="flat" className="text-default-600">
              Volvox 1.0
            </Chip>
            <Button
              onPress={handleSend}
              disabled={disabled || (!message.trim() && !file)}
              color="primary"
              endContent={<PaperAirplaneIcon className="w-4 h-4" />}
              className="transition-all duration-200"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
