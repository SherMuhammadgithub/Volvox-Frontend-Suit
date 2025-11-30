"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Checkbox } from "@heroui/react";
import { Chip } from "@heroui/react";
import { Tooltip } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useResearchStore } from "@/store/researchStore";
import { useAuthStore } from "@/store/authStore";
import { ResearchWork } from "@/types";

interface DocumentSelectorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (doc: ResearchWork) => void;
}

export default function DocumentSelectorModal({
  isOpen,
  onOpenChange,
  onSelect,
}: DocumentSelectorModalProps) {
  const authToken = useAuthStore((s) => s.token);
  const { researchWorks, fetchResearchWorks, loading } = useResearchStore();
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && authToken)
      fetchResearchWorks({ search: searchQuery, authToken });
    if (!isOpen) setSelectedIds([]);
  }, [isOpen, searchQuery, authToken, fetchResearchWorks]);
  const handleSearch = () => {
    setSearchQuery(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchQuery("");
  };

  const allIds = researchWorks.map((doc: ResearchWork) =>
    String(doc._id || doc.id)
  );
  const allSelected = selectedIds.length === allIds.length && allIds.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const handleCheckbox = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    const selectedDocs = researchWorks.filter((doc: ResearchWork) =>
      selectedIds.includes(String(doc._id || doc.id))
    );
    selectedDocs.forEach((doc) => onSelect(doc));
    onOpenChange(false);
  };

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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        <ModalHeader className="sticky top-0 z-20 bg-white dark:bg-default-100 border-b border-default-200">
          Select Documents
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="sticky top-0 z-10 bg-white dark:bg-default-100 px-6 pt-6 pb-2 border-b border-default-200">
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startContent={
                  <DocumentMagnifyingGlassIcon className="w-5 h-5 text-default-400" />
                }
                className="flex-1"
              />
              <Button
                color="primary"
                variant="solid"
                size="sm"
                onPress={handleSearch}
                className="font-semibold"
              >
                Search
              </Button>
              <Button
                color="default"
                variant="flat"
                size="sm"
                onPress={handleClearSearch}
                className="font-semibold"
              >
                Clear
              </Button>
            </div>
            <div className="flex items-center justify-between mb-2">
              <Button
                size="sm"
                color={allSelected ? "primary" : "default"}
                variant={allSelected ? "solid" : "flat"}
                onPress={handleSelectAll}
                className="text-xs"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </Button>
              <Chip
                color={selectedIds.length > 0 ? "primary" : "default"}
                variant="solid"
                className="text-xs bg-primary-600 text-white"
              >
                {selectedIds.length} selected
              </Chip>
            </div>
          </div>
          <div
            className={`overflow-y-auto px-6 pb-6 pt-2${loading ? "" : " space-y-2"}`}
            style={{ maxHeight: 480 }}
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full mt-2 rounded" />
              ))
            ) : researchWorks.length === 0 ? (
              <span className="text-xs text-default-400">
                No documents found
              </span>
            ) : (
              researchWorks.map((doc: ResearchWork) => {
                const id = String(doc._id || doc.id);
                const checked = selectedIds.includes(id);
                const { name, ext } = getFileNameAndExt(doc);
                const displayName = truncate(
                  doc.researchName || doc.title || "",
                  24
                );
                return (
                  <Tooltip
                    content={doc.fileName || doc.researchName || doc.title}
                    showArrow={true}
                    key={id}
                  >
                    <div
                      className={`flex items-center gap-3 p-2 rounded border transition-colors duration-150 ${checked ? "bg-default-100 border-default-300" : "hover:bg-default-100 border-transparent"}`}
                    >
                      <Checkbox
                        isSelected={checked}
                        onChange={() => handleCheckbox(id)}
                        color="primary"
                        aria-label={doc.researchName || doc.title}
                        className="mr-2"
                      />
                      <span className="font-medium truncate flex-1">
                        {displayName}
                      </span>
                      {ext && (
                        <Chip
                          color="default"
                          variant="flat"
                          className="text-xs"
                          title={doc.fileName}
                        >
                          .{ext}
                        </Chip>
                      )}
                      <span className="text-xs text-default-400">
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </Tooltip>
                );
              })
            )}
          </div>
          <div className="px-6 pb-6">
            <Button
              color="primary"
              variant="solid"
              className="mt-4 w-full font-semibold"
              isDisabled={selectedIds.length === 0}
              onPress={handleAddSelected}
            >
              Add Selected
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
