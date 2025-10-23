"use client";
import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";

export function PWAInstallModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setOpen(false);
      }
    }
  };

  return (
    <Modal isOpen={open} onOpenChange={setOpen} hideCloseButton>
      <ModalContent>
        <ModalHeader>Install Volvox App</ModalHeader>
        <ModalBody>
          <p>For the best experience, install Volvox as a Progressive Web App on your device.</p>
          <Button color="primary" onPress={handleInstall} className="mt-4 w-full">
            Install App
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
