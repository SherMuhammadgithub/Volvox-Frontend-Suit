"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";

interface SaveSummaryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (researchName: string) => void;
  loading?: boolean;
}

export default function SaveSummaryModal({
  isOpen,
  onOpenChange,
  onSave,
  loading,
}: SaveSummaryModalProps) {
  const [researchName, setResearchName] = useState("");

  const handleSave = () => {
    if (!researchName) return;
    onSave(researchName);
    setResearchName("");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
      <ModalContent>
        <ModalHeader>Save Summary</ModalHeader>
        <ModalBody>
          <Input
            label="Research Name"
            placeholder="Enter research name..."
            value={researchName}
            onChange={(e) => setResearchName(e.target.value)}
            className="mb-4"
            isRequired
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            variant="solid"
            onPress={handleSave}
            isLoading={loading}
            isDisabled={!researchName}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
