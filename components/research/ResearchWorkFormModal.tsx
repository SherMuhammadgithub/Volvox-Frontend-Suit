"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { Input } from "@heroui/input";

export default function ResearchWorkFormModal({
  isOpen,
  onOpenChange,
  onSubmit,
  loading = false,
  error = null,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, file: File | null) => void | Promise<void>;
  loading?: boolean; // for background/fetching
  error?: string | null;
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [adding, setAdding] = useState(false); // separate state for add

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    setAdding(true);
    try {
      await onSubmit(title, file);
      addToast({
        title: "Success",
        description: "Research work added successfully.",
        color: "success",
      });
      setTitle("");
      setFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message || "Please try again.",
        color: "danger",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Add Research Work</ModalHeader>
            <form
              onSubmit={(e) => handleSubmit(e, onClose)}
              className="space-y-4"
            >
              <ModalBody>
                <Input
                  label="Research Title/Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  label="Attachment (Document Upload)"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  required
                  disabled={loading}
                />
                {previewUrl && (
                  <div className="border rounded p-2 bg-default-100">
                    {file?.type.startsWith("image/") ? (
                      <img
                        src={previewUrl || undefined}
                        alt="Preview"
                        className="max-h-40 mx-auto"
                      />
                    ) : file?.type === "application/pdf" ? (
                      <iframe
                        src={previewUrl || undefined}
                        className="w-full h-40"
                        title="PDF Preview"
                      />
                    ) : (
                      <div className="text-default-400">
                        No preview available
                      </div>
                    )}
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  variant="light"
                  onPress={onClose}
                  disabled={adding}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={adding}
                  disabled={adding}
                >
                  {adding ? "Adding..." : "Add"}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
