"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Textarea, Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Tooltip } from "@heroui/tooltip";
import { Card, CardBody } from "@heroui/card";
import { PaperAirplaneIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useResearchStore } from "@/store/researchStore";
import { useAuthStore } from "@/store/authStore";

interface ChatInputProps {
  onSend: (message: string, researchId?: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedResearch, setSelectedResearch] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { researchWorks, fetchResearchWorks } = useResearchStore();
  const authToken = useAuthStore((s) => s.token);

  // Fetch research works on mount
  useEffect(() => {
    if (authToken && researchWorks.length === 0) {
      fetchResearchWorks({ authToken });
    }
  }, [authToken]);

  // Filter research works based on search query
  const filteredResearchWorks = researchWorks.filter((research) =>
    research.researchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message, selectedResearch?.id);
    setMessage("");
    setSelectedResearch(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectResearch = (id: string, name: string) => {
    setSelectedResearch({ id, name });
    setIsPopoverOpen(false);
    setSearchQuery(""); // Clear search when selecting
  };

  const handleRemoveResearch = () => {
    setSelectedResearch(null);
  };

  // Reset search when popover closes
  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      setSearchQuery("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {selectedResearch && (
        <Card
          shadow="none"
          className="bg-default-900 dark:bg-default-100 border-1 border-default-900 dark:border-default-200"
        >
          <CardBody className="p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-default-700 dark:bg-default-300 flex-shrink-0">
                <DocumentTextIcon className="w-4 h-4 text-white dark:text-default-900" />
              </div>
              <span className="text-sm text-white dark:text-default-900 flex-1 truncate font-semibold">
                {selectedResearch.name}
              </span>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handleRemoveResearch}
                className="flex-shrink-0 text-white dark:text-default-900 hover:bg-default-800 dark:hover:bg-default-200 min-w-6 w-6 h-6"
              >
                <XMarkIcon className="w-4 h-4" />
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex flex-col gap-2 bg-default-100/50 dark:bg-default-100/40 rounded-2xl px-4 py-3 border border-default-300/40">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          disabled={disabled}
          minRows={2}
          maxRows={4}
          classNames={{
            base: "w-full",
            input:
              "text-default-700 placeholder:text-default-400 bg-transparent text-sm font-normal resize-none p-3",
            innerWrapper: "bg-transparent",
            inputWrapper: "bg-transparent shadow-none p-0 h-auto min-h-[40px]",
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Popover
              isOpen={isPopoverOpen}
              onOpenChange={handlePopoverOpenChange}
              placement="top-start"
            >
              <Tooltip content="Attach your research work" placement="top">
                <div className="relative">
                  <PopoverTrigger>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      disabled={disabled}
                      className="text-default-500 hover:text-default-700 transition-colors"
                    >
                      <DocumentTextIcon className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  {selectedResearch && (
                    <Chip
                      size="sm"
                      className="absolute -top-1 -right-1 bg-default-900 dark:bg-default-100 min-w-0 h-4 w-4 p-0"
                    >
                      <span className="text-[10px] font-bold text-white dark:text-default-900">
                        1
                      </span>
                    </Chip>
                  )}
                </div>
              </Tooltip>
              <PopoverContent className="p-0 w-80">
                <div className="min-h-[300px] max-h-[420px] flex flex-col">
                  {researchWorks.length === 0 ? (
                    <Card shadow="none" className="bg-transparent flex-1">
                      <CardBody className="text-center py-8 flex items-center justify-center">
                        <div className="flex justify-center mb-3">
                          <div className="p-3 bg-default-100 dark:bg-default-200/30 rounded-full">
                            <DocumentTextIcon className="w-7 h-7 text-default-400" />
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-default-700 dark:text-default-200 mb-1">
                          No research works found
                        </p>
                        <p className="text-xs text-default-500 dark:text-default-400">
                          Add research works from the Research page
                        </p>
                      </CardBody>
                    </Card>
                  ) : (
                    <>
                      {/* Search Input */}
                      <div className="p-3 border-b border-default-200">
                        <Input
                          size="sm"
                          placeholder="Search research works..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          startContent={
                            <MagnifyingGlassIcon className="w-4 h-4 text-default-400" />
                          }
                          classNames={{
                            input: "text-sm",
                            inputWrapper:
                              "bg-default-100 dark:bg-default-50/5 border-1 border-default-200 dark:border-default-100/10",
                          }}
                        />
                      </div>

                      {/* Research List */}
                      <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
                        <style>{`
                          .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                          }
                          .scrollbar-hide {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                          }
                        `}</style>
                        {filteredResearchWorks.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-sm text-default-500">
                              No results found
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {filteredResearchWorks.map((research) => {
                              const isSelected =
                                selectedResearch?.id ===
                                (research._id || research.id);
                              return (
                                <Card
                                  key={research._id || research.id}
                                  isPressable
                                  onPress={() =>
                                    handleSelectResearch(
                                      research._id || research.id || "",
                                      research.researchName
                                    )
                                  }
                                  className={`w-full ${
                                    isSelected
                                      ? "bg-default-900 dark:bg-default-100 border-1 border-default-900 dark:border-default-200"
                                      : "bg-default-100 dark:bg-default-50/5 hover:bg-default-200 dark:hover:bg-default-100/10"
                                  } transition-all`}
                                  shadow="none"
                                >
                                  <CardBody className="p-2.5">
                                    <div className="flex items-start gap-2.5">
                                      <div
                                        className={`p-1.5 rounded-md flex-shrink-0 ${
                                          isSelected
                                            ? "bg-default-700 dark:bg-default-300"
                                            : "bg-default-200 dark:bg-default-100/10"
                                        }`}
                                      >
                                        <DocumentTextIcon
                                          className={`w-4 h-4 ${
                                            isSelected
                                              ? "text-white dark:text-default-900"
                                              : "text-default-600 dark:text-default-400"
                                          }`}
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p
                                          className={`text-sm font-semibold truncate ${
                                            isSelected
                                              ? "text-white dark:text-default-900"
                                              : "text-default-700 dark:text-default-500"
                                          }`}
                                          title={research.researchName}
                                          style={{
                                            maxWidth: "180px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            display: "block",
                                          }}
                                        >
                                          {research.researchName}
                                        </p>
                                        <p
                                          className={`text-xs mt-0.5 ${
                                            isSelected
                                              ? "text-default-200 dark:text-default-600"
                                              : "text-default-500 dark:text-default-400"
                                          }`}
                                        >
                                          {new Date(
                                            research.createdAt
                                          ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })}
                                        </p>
                                      </div>
                                      {isSelected && (
                                        <div className="flex-shrink-0">
                                          <Chip
                                            size="sm"
                                            variant="flat"
                                            className="bg-default-700 dark:bg-default-300 min-w-0 h-5 px-1.5"
                                          >
                                            <svg
                                              className="w-3 h-3 text-white dark:text-default-900"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                          </Chip>
                                        </div>
                                      )}
                                    </div>
                                  </CardBody>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-xs text-default-500">
              Attach research work
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Chip size="sm" variant="flat" className="text-default-600">
              Volvox 1.0
            </Chip>
            <Button
              onPress={handleSend}
              disabled={disabled || !message.trim()}
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
