"use client";
import React from "react";
import { Button, Chip, Tooltip } from "@heroui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ResearchWork } from "@/types";

interface SelectedDocumentListProps {
  selectedDocs: ResearchWork[];
  onDeselect?: (id: string) => void;
}

export default function SelectedDocumentList({
  selectedDocs,
  onDeselect,
}: SelectedDocumentListProps) {
  // Helper to get file name and extension
  const getFileNameAndExt = (doc: ResearchWork) => {
    if (doc.fileName) {
      const parts = doc.fileName.split(".");
      if (parts.length > 1) {
        return {
          name: parts.slice(0, -1).join("."),
          ext: parts[parts.length - 1],
        };
      }
      return { name: doc.fileName, ext: "" };
    }
    return { name: "", ext: "" };
  };

  // Helper to truncate researchName/title
  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n) + "..." : str;


  return (
    <div className="flex flex-col gap-2 mb-4">
      {selectedDocs.length === 0 ? (
        <span className="text-xs text-default-400">No documents selected</span>
      ) : (
        selectedDocs.map((doc: ResearchWork) => {
          const { name, ext } = getFileNameAndExt(doc);
          const displayName = truncate(doc.researchName || doc.title || "", 24);
          return (
            <Tooltip
              content={
                doc.fileName
                  ? `${doc.fileName}`
                  : `${doc.researchName || doc.title}${ext ? `.${ext}` : ""}`
              }
              showArrow={true}
              key={doc._id || doc.id}
            >
              <div className="flex items-center gap-3 p-2 rounded-lg bg-default-50 border border-default-200">
                <DocumentMagnifyingGlassIcon className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-semibold truncate flex-1 text-default-800">
                  {displayName}
                </span>
                {ext && (
                  <Chip
                    color="primary"
                    variant="flat"
                    className="text-xs"
                    title={doc.fileName}
                  >
                    .{ext}
                  </Chip>
                )}
                <Button
                  isIconOnly
                  size="sm"
                  color="default"
                  variant="light"
                  aria-label="Deselect"
                  className="ml-2"
                  onPress={() => onDeselect && onDeselect(String(doc._id || doc.id))}
                >
                  <XMarkIcon className="w-4 h-4 text-default-500" />
                </Button>
              </div>
            </Tooltip>
          );
        })
      )}
    </div>
  );
}
